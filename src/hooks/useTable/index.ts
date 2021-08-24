import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounceFn, useUpdateEffect } from 'ahooks';
import { PaginationProps } from 'antd/lib/pagination';
import { FormInstance } from 'antd/lib/form';
import { TableRowSelection } from 'antd/lib/table/interface';
import usePost, { UsePostOptions } from '../usePost';

export interface API {
  search: string;
  [url: string]: string;
}

export type Key = string | number;

export interface ActionOptions {
  payload?: FormValues; // 请求参数
  callback?: (response: any) => void;
  reload?: boolean; // 请求完成后是否刷新列表，默认true
  resetPageIndex?: boolean; // 是否回到第一页，默认true
}

export interface Actions<T> {
  dataSource: T[];
  setDataSource: React.Dispatch<React.SetStateAction<T[]>>;
  loading: { [key: string]: boolean };
  action: { [key: string]: (actionOptions?: ActionOptions) => Promise<any> };
  pagination: PaginationProps;
  selectedRowKeys: Key[];
  selectedRows: T[];
  tableProps: {
    dataSource: T[];
    pagination: PaginationProps;
    loading: boolean;
    rowSelection?: {
      selectedRowKeys: Key[];
      onChange: (selectedRowKeys: Key[], selectedRows: T[]) => void;
    };
  };
}

export interface FormValues {
  pageIndex?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface Options<T> extends UsePostOptions {
  defaultPageIndex?: number;
  defaultPageSize?: number;
  form?: FormInstance;
  initSearchParams?: FormValues; // 初始化搜索参数
  onRequestError?: (e: Error) => void;
  searchParamsFormatter?: (formValues: FormValues) => FormValues; // 格式化搜索参数
  dataSourceFormatter?: (response: { [key: string]: any }) => { items: T[]; totalCount: number }; // 格式化搜索接口返回值
  rowSelection?: TableRowSelection<T> | boolean;
}

const ficklePromise = (() => {
  let count = 0;
  return (promise: Promise<any>): Promise<any> =>
    ((currentCount) =>
      new Promise((resolve) => {
        promise.then((result) => {
          if (currentCount === count) {
            resolve(result);
          }
        });
        // eslint-disable-next-line no-plusplus
      }))(++count);
})();

function usePageList<T = any>(api: API | string, options?: Options<T>): Actions<T> {
  const {
    manual = true,
    defaultPageIndex = 1,
    defaultPageSize = 20,
    onRequestError,
    form,
    initSearchParams,
    searchParamsFormatter = (formValues: FormValues) => formValues,
    dataSourceFormatter,
    rowSelection: propsRowSelection,
  } = options || {};
  const { run } = usePost();
  const [dataSource, setDataSource] = useState<Actions<T>['dataSource']>([]);
  const [loading, setLoading] = useState<Actions<T>['loading']>({
    search: false,
  });
  const [pageInfo, setPageInfo] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: defaultPageIndex,
    pageSize: defaultPageSize,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<FormValues>(initSearchParams || {});
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [hasLoad, setHasLoad] = useState<boolean>();

  const getFieldsValue = useCallback<() => FormValues>(() => {
    if (!form) {
      return {};
    }

    return form.getFieldsValue();
  }, [form]);

  const validateFields = useCallback<() => Promise<any>>(() => {
    if (!form) {
      return Promise.resolve();
    }
    return form.validateFields();
  }, [form]);

  const onCleanSelected = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  const searchFn = useCallback<(options?: ActionOptions) => Promise<any>>(
    (options?: ActionOptions) =>
      validateFields()
        .then(
          () =>
            new Promise((resolve, reject) => {
              const { current, pageSize } = pageInfo;
              const { payload, resetPageIndex = true } = options || {};
              // 如果是自定义form 且没有传 payload，则使用 searchParams 以在分页时保留搜索参数
              const newSearchParams = payload || searchParams;

              if (resetPageIndex && current !== 1) {
                setPageInfo({ ...pageInfo, current: 1 });
                return;
              }

              setLoading((preLoading) => ({ ...preLoading, search: true }));
              ficklePromise(
                run(
                  typeof api === 'string' ? api : (api as API).search,
                  searchParamsFormatter({
                    ...newSearchParams,
                    pageIndex: current,
                    pageSize,
                  }),
                ),
              )
                .then((response) => {
                  const { items, totalCount } = dataSourceFormatter
                    ? dataSourceFormatter(response)
                    : response?.data || {};
                  setDataSource(items || []);
                  setPageInfo({ ...pageInfo, total: totalCount || 0 });
                  onCleanSelected();
                  resolve(items || []);
                  setLoading((preLoading) => ({ ...preLoading, search: false }));
                })
                .catch((e) => {
                  if (onRequestError === undefined) {
                    reject(e);
                  } else {
                    onRequestError(e);
                  }
                });
            }),
        )
        .catch((err) => err),
    [getFieldsValue, run, searchParams, pageInfo, api],
  );

  const { run: search, cancel: cancelSearch } = useDebounceFn(searchFn, {
    wait: 450,
    // leading: dataSource.length === 0,
  });

  const searchAction = useCallback<(options?: ActionOptions) => Promise<any>>(
    (options) => {
      const { payload } = options || {};

      let newSearchParams;
      if (payload || form) {
        newSearchParams = payload || getFieldsValue();
        setSearchParams(newSearchParams);
      }

      if (!hasLoad) {
        setHasLoad(true);
        return searchFn({ ...options, payload: newSearchParams });
      }

      return search({ ...options, payload: newSearchParams });
    },
    [search, hasLoad],
  );

  useEffect(() => {
    if (!manual) {
      searchAction({ payload: initSearchParams });
    }
    return () => {
      cancelSearch();
    };
  }, []);

  useUpdateEffect(() => {
    search({ resetPageIndex: false });
    return () => {
      cancelSearch();
    };
  }, [pageInfo.current, pageInfo.pageSize]);

  const triggerCustomActions = useCallback<(key: string, options?: ActionOptions) => Promise<any>>(
    (key, customActionOptions) =>
      new Promise((resolve, reject) => {
        setLoading((preLoading) => ({ ...preLoading, [key]: true }));
        const {
          payload,
          callback,
          reload = true,
          resetPageIndex = true,
        } = customActionOptions || {};

        run((api as API)[key], payload || {})
          .then((response) => {
            if (callback) {
              callback(response);
            }
            resolve(response);
            setLoading((preLoading) => ({ ...preLoading, [key]: false }));
            if (reload) {
              search({ resetPageIndex });
            }
          })
          .catch((e) => {
            setLoading((preLoading) => ({ ...preLoading, [key]: false }));
            if (onRequestError === undefined) {
              reject(e);
            } else {
              onRequestError(e);
            }
          });
      }),
    [search, run, api],
  );

  const reset = useCallback<() => Promise<any>>(() => {
    if (form) {
      form.resetFields();
    }

    // 如果有antd form时，应该使用 getFieldsValue() 获取重置后的参数
    return searchAction(!form ? { payload: {} } : undefined);
  }, [form, search]);

  const fetchActions = useMemo<Actions<T>['action']>(
    () =>
      Object.keys(typeof api === 'object' ? api : {})
        .filter((key) => key !== 'search')
        .reduce(
          (actions: Actions<T>['action'], key: string) => ({
            ...actions,
            [key]: (options?: ActionOptions) => triggerCustomActions(key, options),
          }),
          {
            search: searchAction,
            reset,
          },
        ),
    [api, searchAction, triggerCustomActions],
  );

  const mergePagination = useCallback(
    (pageInfo: { current: number; pageSize: number; total: number }): PaginationProps => {
      const { current, pageSize } = pageInfo;

      return {
        // showTotal: (totalCount) => (
        //   <span>
        //     共<b>{Math.ceil(totalCount / pageSize)}</b>页<b>{totalCount}</b>条数据
        //   </span>
        // ),
        showSizeChanger: false,
        showQuickJumper: true,
        ...pageInfo,
        onChange: (newPage, newPageSize) => {
          if (newPage !== current) {
            setPageInfo({ ...pageInfo, current: newPage });
          }
          if (newPageSize !== pageSize && newPageSize != null) {
            setPageInfo({ ...pageInfo, pageSize: newPageSize });
          }
        },
        onShowSizeChange: (_, pageSize) => {
          setPageInfo({ ...pageInfo, current: 1, pageSize });
        },
      };
    },
    [],
  );

  const pagination = useMemo(() => mergePagination(pageInfo), [pageInfo]);

  const rowSelection: Actions<T>['tableProps']['rowSelection'] = useMemo(
    () =>
      propsRowSelection
        ? {
            selectedRowKeys,
            ...(typeof propsRowSelection === 'object' ? propsRowSelection : {}),
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectedRows(rows);
              if (typeof propsRowSelection === 'object' && propsRowSelection.onChange) {
                propsRowSelection.onChange(keys, rows);
              }
            },
          }
        : undefined,
    [propsRowSelection, selectedRowKeys],
  );

  return {
    action: fetchActions,
    dataSource,
    setDataSource,
    loading,
    pagination,
    selectedRowKeys,
    selectedRows,
    tableProps: {
      loading: loading.search,
      dataSource,
      pagination,
      rowSelection,
    },
  };
}

export default usePageList;
