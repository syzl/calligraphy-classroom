import gql from 'graphql-tag';
import * as _ from 'lodash';

import { GQLFragments, SelfFrags } from './fragments';

export const CREATE_DEMONSTRATE = gql`
  ${GQLFragments.demonstrate}
  mutation CreateDemonstrate($input: CreateDemonstrateInput!) {
    createDemonstrate(input: $input) {
      id
      ...DemonstrateFragment
    }
  }
`;
export const DELETE_DEMONSTRATE = gql`
  ${GQLFragments.demonstrate}
  mutation DeleteDemonstrate($id: Int!) {
    deleteDemonstrate(id: $id) {
      id
      ...DemonstrateFragment
    }
  }
`;
export const DELETE_DEMONSTRATE_VIDEO = gql`
  mutation DeleteDemonstrateVideo($id: Int!) {
    deleteDemonstrate(id: $id)
  }
`;
export const UPDATE_DEMONSTRATE = gql`
  ${GQLFragments.upload}
  ${GQLFragments.demonstrate_detail}
  mutation UpdateDemonstrate($id: Int!, $input: UpdateDemonstrateInput!) {
    updateDemonstrate(id: $id, input: $input) {
      id
      ...DemonstrateFragmentD
    }
  }
`;
export const API_DEMONSTRATES = gql`
  ${GQLFragments.upload}
  ${GQLFragments.demonstrate_detail}
  query Demonstrates($limit: Int, $page: Int, $by: Int) {
    api_demonstrates(limit: $limit, page: $page, by: $by) {
      items {
        id
        ...DemonstrateFragmentD
      }
      ${SelfFrags.pagedResultMeta}
    }
  }
`;
export const API_DEMONSTRATE = gql`
  ${GQLFragments.upload}
  ${GQLFragments.demonstrate_detail}
  query Demonstrate($id: Int!) {
    api_demonstrate(id: $id) {
      id
      ...DemonstrateFragmentD
    }
  }
`;
