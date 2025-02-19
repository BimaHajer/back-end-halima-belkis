/* eslint-disable */
import { FindOperator, In } from 'typeorm';
export class FilterDto<OBJ extends object = AnyObject> {
  select?: (keyof OBJ)[];
  order?: Order<OBJ>;
  skip?: number;
  take?: number;
  relations?: string[];
  readonly join?: any;
  where?:| any;
  loadRelationIds?: boolean;
}


export declare type Order<MT = AnyObject> = {
  [P in keyof MT]: Direction;
};

export declare type Direction = 'ASC' | 'DESC' | 1 | -1;

export interface AnyObject {
  [property: string]: any;
}

export function parseFilter(filter: string) {
  const { take, skip, where, loadRelationIds } = JSON.parse(filter);

  const options: any = {
    take,
    skip,
    loadRelationIds: loadRelationIds === true,
  };

  // Ajouter le filtre where si présent
  if (where) {
    // Gestion de l'ID avec l'opérateur In
    if (where.id && where.id.type === 'in') {
      options.where = {
        id: In(where.id.value),
      };
    }
  }

  return options;
}
