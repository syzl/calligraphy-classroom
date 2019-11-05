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
    fragment DemonstrateFragment on Course {
      title
      desc
      type
      subType
      updatedAt
      createdAt
    }
  `,
};
