export const SelfFrags = {
  pagedResultMeta: `\
    itemCount
    totalItems
    pageCount
    next
    previous`,
  uploadRelatedItem: `\
    id
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
      }
    }
  `,
  de_video: `
  fragment DevideoFragment on DemonstrateVideo {
    startedAt
    duration
    thumb {
      ${SelfFrags.uploadRelatedItem}
    }
    video {
      ${SelfFrags.uploadRelatedItem}
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
};
