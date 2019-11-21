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
    updatedAt
    createdAt`,
  demonstrate: `\
    title
    desc
    type
    subType
    updatedAt
    createdAt`,
};

export const GQLFragments = {
  base: `\
    fragment base on BaseEntity {
      id
      createdAt
      updatedAt
    }
  `,
  course_base: `\
    fragment CourseFragmentBase on Course {
      ${SelfFrags.course}
    }
  `,
  course: `\
    fragment CourseFragment on Course {
      ${SelfFrags.course}
      demonstrates {
        id
        title
        desc
        type
        subType
        updatedAt
        createdAt
      }
    }
  `,
  demonstrate: `\
    fragment DemonstrateFragment on Demonstrate {
      ${SelfFrags.demonstrate}
      course {
        id
        name
        desc
        teacher
        updatedAt
        createdAt
      }
    }
  `,
  demonstrate_detail: `\
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
  de_video: `
  fragment DevideoFragment on DemonstrateVideo {
    startedAt
    duration
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
  upload: `\
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
  copybook: `\
    fragment CopybookFragment on UploadCopybook {
      ${SelfFrags.uploadRelatedItem}
    }
  `,
};
