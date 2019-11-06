import gql from 'graphql-tag';
import * as _ from 'lodash';

import { GQLFragments, SelfFrags } from './fragments';

export const DELETE_UPLOAD_RAW = gql`
  ${GQLFragments.upload}
  mutation DeleteUpload($id: Int!) {
    deleteUpload(id: $id) {
      id
      ...UploadFragment
    }
  }
`;
export const API_UPLOAD_RAWS = gql`
    ${GQLFragments.upload}
    query UploadRaws($limit: Int, $page: Int) {
      api_upload_raws(limit: $limit, page: $page) {
        items {
          id
          ...UploadFragment
        }
        ${SelfFrags.pagedResultMeta}
      }
    }
  `;
