import gql from 'graphql-tag';

export const SelfFrags = {
  cursoredResult: `\
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  `,
  pagedResultMeta: `\
    itemCount
    totalItems
    pageCount
    next
    previous`,
  uploadRelatedItem: `\
    raw {
      id
      fieldname
      originalname
      encoding
      mimetype
      destination
      filename
      path
      size
      createdAt
    }`,
  course: `\
    name
    desc
    teacher
    sort
    updatedAt
    createdAt`,
  demonstrate: `\
    title
    desc
    type
    subType
    sort
    updatedAt
    createdAt`,
};

export const GQLFragments = {
  base: gql`
    fragment base on BaseEntity {
      id
      createdAt
      updatedAt
    }
  `,
  course_base: gql`\
    fragment CourseFragmentBase on Course {
      ${SelfFrags.course}
    }
  `,
  course_relation: gql`
    fragment CourseFragmentRelation on Course {
      demonstrates {
        id
      }
    }
  `,
  course: gql`\
    fragment CourseFragment on Course {
      ${SelfFrags.course}
      demonstrates {
        id
        title
        desc
        type
        subType
        sort
        updatedAt
        createdAt
      }
    }
  `,
  demonstrate: gql`\
    fragment DemonstrateFragment on Demonstrate {
      ${SelfFrags.demonstrate}
      course {
        id
        name
        desc
        teacher
        sort
        updatedAt
        createdAt
      }
    }
  `,

  demonstrate_base: gql`\
    fragment DemonstrateFragmentBase on Demonstrate {
      ${SelfFrags.demonstrate}
    }
  `,
  demonstrate_relation: gql`
    fragment DemonstrateFragmentRelation on Demonstrate {
      course {
        id
      }
      videos {
        id
      }
    }
  `,
  demonstrate_detail: gql`\
    fragment DemonstrateFragmentD on Demonstrate {
      ${SelfFrags.demonstrate}
      course {
        id
        ${SelfFrags.course}
      }
      videos {
        id
        startedAt
        duration
        char
        remark
        thumb {
          ${SelfFrags.uploadRelatedItem}
        }
        video {
          ${SelfFrags.uploadRelatedItem}
        }
        copybooks {
          id
          ${SelfFrags.uploadRelatedItem}
        }
      }
    }
  `,
  de_video_base: gql`
    fragment DevideoFragmentBase on DemonstrateVideo {
      startedAt
      duration
      char
      remark
    }
  `,
  de_video: gql`
    fragment DevideoFragment on DemonstrateVideo {
      startedAt
      duration
      char
      remark
      thumb {
        id
        ${SelfFrags.uploadRelatedItem}
      }
      video {
        id
        ${SelfFrags.uploadRelatedItem}
      }
      copybooks {
        id
        ${SelfFrags.uploadRelatedItem}
      }
      demonstrate {
        id
        ${SelfFrags.demonstrate}
      }
    }
  `,
  upload: gql`
    fragment UploadFragment on UploadRaw {
      fieldname
      originalname
      encoding
      mimetype
      destination
      filename
      path
      size
      updatedAt
      createdAt
    }
  `,
  copybook: gql`\
    fragment CopybookFragment on UploadCopybook {
      ${SelfFrags.uploadRelatedItem}
    }
  `,
};
