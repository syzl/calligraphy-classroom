import gql from 'graphql-tag';
import * as _ from 'lodash';

import { SignInReturn } from '../interfaces';

export class GQLFragments {
  static base = gql`
    fragment base on BaseEntity {
      id
      createdAt
      updatedAt
    }
  `;
  static course = `
    fragment CourseFragment on Course {
      name
      desc
      teacher
      updatedAt
      createdAt
    }
  `;
}

export class GQL {
  static signInParser = (data: any) => {
    console.log('signInParser', data);
    const signinUser: SignInReturn = _.get(data, 'signinUser');
    return signinUser;
  };
  static SIGN_IN = gql`
    mutation Signin($username: String!, $password: String!) {
      signinUser(username: $username, password: $password) {
        accessToken
        expiresIn
      }
    }
  `;
  // WhoAmI
  static WHOAMI = gql`
    {
      auth_whoami {
        username
        id
        email
        isActive
      }
    }
  `;
  static CREATE_COURSE = gql`
    ${GQLFragments.course}
    mutation CreateCourse($name: String!) {
      createCourse(data: { name: $name }) {
        id
        ...CourseFragment
      }
    }
  `;
  static DELETE_COURSE = gql`
    ${GQLFragments.course}
    mutation DeleteCourse($id: Int!) {
      deleteCourse(id: $id) {
        id
        ...CourseFragment
      }
    }
  `;
  static API_COURCES = gql`
    ${GQLFragments.course}
    query Courses($limit: Int, $page: Int) {
      api_courses(limit: $limit, page: $page) {
        items {
          id
          ...CourseFragment
        }
        itemCount
        totalItems
        pageCount
        next
        previous
      }
    }
  `;
}
