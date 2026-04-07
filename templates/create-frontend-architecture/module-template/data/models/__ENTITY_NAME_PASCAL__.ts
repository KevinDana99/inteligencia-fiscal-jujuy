export interface I__ENTITY_NAME_PASCAL__ {
  id: string;
  title: string;
  description: string;
}

export interface IGet__ENTITY_NAME_PASCAL__Params {
  id: string;
}

export interface IUpdate__ENTITY_NAME_PASCAL__Params {
  id: string;
  title: string;
}

export interface ICommandResult {
  success: boolean;
  error?: string;
}

export interface IModuleQueryResult<TData> {
  data: TData | null;
  error?: string;
}
