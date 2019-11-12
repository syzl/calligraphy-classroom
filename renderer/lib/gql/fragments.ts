export const SelfFrags = {
  pagedResultMeta: `\
      itemCount
      totalItems
      pageCount
      next
      previous`,
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
      name
      desc
      teacher
      updatedAt
      createdAt
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
      title
      desc
      type
      subType
      updatedAt
      createdAt
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
      title
      desc
      type
      subType
      updatedAt
      createdAt
      course {
        id
        name
        desc
        teacher
      }
      videos {
        id
        upload {
          id
          ...UploadFragment
        }
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
