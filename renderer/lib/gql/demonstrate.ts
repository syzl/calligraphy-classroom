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
  ${GQLFragments.demonstrate_base}
  mutation UpdateDemonstrate($id: Int!, $data: UpdateDemonstrateInput!) {
    updateDemonstrate(id: $id, data: $data) {
      id
      ...DemonstrateFragmentBase
    }
  }
`;
export const API_DEMONSTRATES = gql`
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
  ${GQLFragments.demonstrate_detail}
  query Demonstrate($id: Int!) {
    api_demonstrate(id: $id) {
      id
      ...DemonstrateFragmentD
    }
  }
`;

export const S_DEMON__C_RELATION = gql`
  ${GQLFragments.demonstrate}
  subscription {
    relation: demonstrateRelateCourse {
      id
      ...DemonstrateFragment
    }
  }
`;
export const API_DEMON_VIDEOS = gql`
  ${GQLFragments.de_video}
  query DemonVideos($limit: Int, $page: Int, $by: Int) {
    pagedItems: api_demon_videos(limit: $limit, page: $page, by: $by) {
      items {
        id
        ...DevideoFragment
      }
      ${SelfFrags.pagedResultMeta}
    }
  }
`;
export const API_DEMON_VIDEO = gql`
  ${GQLFragments.de_video}
  query DemonVideo($id: Int!) {
    api_demon_video(id: $id) {
      id
      ...DevideoFragment
    }
  }
`;

export const S_VIDEO_DEMON = gql`
  ${GQLFragments.de_video}
  subscription {
    relation: videoRelateDemon {
      id
      ...DevideoFragment
    }
  }
`;

export const S_DEMON_VIDEO = gql`
  ${GQLFragments.demonstrate_relation}
  subscription($demonId: Int!) {
    relation: DemonRelateVideo(demonId: $demonId) {
      id
      ...DemonstrateFragmentRelation
    }
  }
`;
