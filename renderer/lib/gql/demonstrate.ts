import gql from 'graphql-tag';
import * as _ from 'lodash';

import { GQLFragments, SelfFrags } from './fragments';

export const CREATE_DEMOSTRATE = gql`
  ${GQLFragments.demonstrate}
  mutation CreateDemonstrate($input: CreateDemonstrateInput!) {
    createDemonstrate(input: $input) {
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
export const UPDATE_DEMOSTRATE = gql`
  ${GQLFragments.upload}
  ${GQLFragments.demonstrate_detail}
  mutation UpdateDemonstrate($id: Int!, $input: UpdateDemonstrateInput!) {
    updateDemonstrate(id: $id, input: $input) {
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
export const API_DEMOSTRATE = gql`
  ${GQLFragments.upload}
  ${GQLFragments.demonstrate_detail}
  query Demonstrate($id: Int!) {
    api_demonstrate(id: $id) {
      id
      ...DemonstrateFragment
    }
  }
`;
