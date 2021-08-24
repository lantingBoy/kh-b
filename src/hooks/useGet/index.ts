import { useRequest } from 'ahooks';
import { BaseOptions, BaseResult } from '@ahooksjs/use-request/es/types';
import { get } from '@/libs/request';

export type UsePostOptions<R = any, P extends any[] = any> = BaseOptions<R, P> & {
  payload?: { [key: string]: any }; // 请求参数
};

function usePost<R = any, P extends any[] = any>(
  arg?: string | UsePostOptions,
  usePostOptions?: UsePostOptions,
): BaseResult<R, P> {


  const options = typeof arg !== 'string' ? arg : usePostOptions;
  const { payload, ...useRequestOptions } = options || {};


  return useRequest(
    (...postArgs) =>
      typeof arg === 'string'
        ? get(arg, { ...payload, ...postArgs[0] })
        : get(...(postArgs as [string, { [key: string]: any }])),
    {
      manual: true,
      ...useRequestOptions,
    },
  );
}

export default usePost;
