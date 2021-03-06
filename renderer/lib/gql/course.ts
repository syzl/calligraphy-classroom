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

// 不查询关联字段
export const UPDATE_COURSE = gql`
  ${GQLFragments.course_base}
  mutation UpdateCourse($id: Int!, $data: UpdateCourseInput!) {
    updated: updateCourse(id: $id, data: $data) {
      id
      ...CourseFragmentBase
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

export const API_COURSE = gql`
  ${GQLFragments.course}
  query Course($id: Int!) {
    api_course(id: $id) {
      id
      ...CourseFragment
    }
  }
`;

export const S_COURSE_DEMON_RELATION = gql`
  ${GQLFragments.course_relation}
  subscription($courseId: Int!) {
    relation: courseRelateDemonstrate(courseId: $courseId) {
      id
      ...CourseFragmentRelation
    }
  }
`;
