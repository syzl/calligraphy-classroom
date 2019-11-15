import gql from 'graphql-tag';
import * as _ from 'lodash';

import { GQLFragments, SelfFrags } from './fragments';

export const DELETE_UPLOAD_RAW = gql`
  ${GQLFragments.upload}
  mutation deleteUploadRaw($id: Int!) {
    deleteUploadRaw(id: $id) {
      id
      ...UploadFragment
    }
  }
`;
export const API_UPLOAD_RAWS = gql`
  ${GQLFragments.upload}
  query UploadRaws($limit: Int, $page: Int, $by: Int) {
    api_upload_raws(limit: $limit, page: $page, by: $by) {
      items {
        id
        ...UploadFragment
        relatedThumb {
          id
        }
        relatedVideo {
          id
        }
      }
      ${SelfFrags.pagedResultMeta}
    }
  }
`;

export const COURSE_COPYBOOKS = gql`
  query QueryCopybooks($cursor: CursorQuery) {
    copybooks: cursor_copybooks(cursor: $cursor) {
      edges {
        node {
          id
          ${SelfFrags.uploadRelatedItem}
          demon_video {
            id
          }
        }
        cursor
      }
      ${SelfFrags.cursoredResult}
    }
  }
`;
