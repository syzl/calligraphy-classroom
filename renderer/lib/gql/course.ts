import gql from 'graphql-tag';
import * as _ from 'lodash';

import { GQLFragments, SelfFrags } from './fragments';

export const CREATE_COURSE = gql`
  ${GQLFragments.course}
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      ...CourseFragment
    }
  }
`;

export const DELETE_COURSE = gql`
  ${GQLFragments.course}
  mutation DeleteCourse($id: Int!) {
    deleteCourse(id: $id) {
      id
      ...CourseFragment
    }
  }
`;

export const API_COURSES = gql`
    ${GQLFragments.course}
    query Courses($limit: Int, $page: Int) {
      api_courses(limit: $limit, page: $page) {
        items {
          id
          ...CourseFragment
        }
        ${SelfFrags.pagedResultMeta}
      }
    }
  `;
