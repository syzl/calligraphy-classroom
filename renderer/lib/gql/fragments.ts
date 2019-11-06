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
    }
  `,
  upload: `\
    fragment UploadFragment on Upload {
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
