import type {
  ICommandResult,
  I__ENTITY_NAME_PASCAL__,
  IGet__ENTITY_NAME_PASCAL__Params,
  IUpdate__ENTITY_NAME_PASCAL__Params
} from '../models/__ENTITY_NAME_PASCAL__';

export interface I__ENTITY_NAME_PASCAL__QueryPort {
  get__ENTITY_NAME_PASCAL__(
    params: IGet__ENTITY_NAME_PASCAL__Params
  ): Promise<I__ENTITY_NAME_PASCAL__>;
}

export interface I__ENTITY_NAME_PASCAL__CommandPort {
  update__ENTITY_NAME_PASCAL__(
    params: IUpdate__ENTITY_NAME_PASCAL__Params
  ): Promise<ICommandResult>;
}

export interface I__ENTITY_NAME_PASCAL__Source
  extends I__ENTITY_NAME_PASCAL__QueryPort,
    I__ENTITY_NAME_PASCAL__CommandPort {}
