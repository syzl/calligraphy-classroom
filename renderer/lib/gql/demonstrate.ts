import gql from 'graphql-tag';
import * as _ from 'lodash';

import { GQLFragments, SelfFrags } from './fragments';

export const CREATE_DEMOSTRATE = gql`
  ${GQLFragments.demonstrate}
  mutation CreateDemonstrate($name: String!) {
    createDemonstrate(data: { name: $name }) {
      id
      ...DemonstrateFragment
    }
  }
`;
export const DELETE_DEMOSTRATE = gql`
  ${GQLFragments.demonstrate}
  mutation DeleteDemonstrate($id: Int!) {
    deleteDemonstrate(id: $id) {
      id
      ...DemonstrateFragment
    }
  }
`;
export const API_DEMOSTRATES = gql`
    ${GQLFragments.demonstrate}
    query Demonstrates($limit: Int, $page: Int) {
      api_demonstrates(limit: $limit, page: $page) {
        items {
          id
          ...DemonstrateFragment
        }
        ${SelfFrags.pagedResultMeta}
      }
    }
  `;
