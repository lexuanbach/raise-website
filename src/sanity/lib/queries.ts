import { groq } from "next-sanity"

export const membersQuery = groq`
*[_type == "member"] | order(name asc){
  _id,
  name,
  role,
  bio,
  photo,
  email,
  phone,
  office,
  googleScholar,
  dblp,
  orcid,
  github,
  website,
  linkedin,
  "slug": slug.current
}
`

export const newsQuery = groq`
*[_type == "news"] | order(publishedAt desc){
  _id,
  title,
  excerpt,
  publishedAt,
  "slug": slug.current
}
`

export const eventsQuery = groq`
*[_type == "event"] | order(startDate desc){
  _id,
  title,
  location,
  startDate,
  endDate,
  summary,
  description,
  poster,
  "slug": slug.current
}
`

export const researchQuery = groq`
*[_type == "researchDirection"] | order(title asc){
  _id,
  title,
  shortDescription,
  keywords,
  "slug": slug.current
}
`

export const publicationsQuery = groq`
*[_type == "publication"] | order(year desc){
  _id,
  title,
  authors[]{
    _type == "reference" => @->{
      _id,
      name,
      "slug": slug.current
    },
    _type == "externalAuthor" => {
      "name": name,
      "slug": null
    }
  },
  venue,
  year,
  paperUrl,
  codeUrl,
  "slug": slug.current
}
`

export const memberBySlugQuery = groq`
*[_type == "member" && slug.current == $slug][0]{
  _id,
  name,
  role,
  email,
  phone,
  office,
  googleScholar,
  dblp,
  orcid,
  github,
  website,
  linkedin,
  bio,
  photo,

  "publications": *[_type == "publication" && references(^._id)] | order(year desc){
    _id,
    title,
    venue,
    year,
    paperUrl,
    codeUrl,
    "slug": slug.current
  }
}
`

export const newsBySlugQuery = groq`
*[_type == "news" && slug.current == $slug][0]{
  _id,
  title,
  excerpt,
  body,
  publishedAt,
  coverImage,
  "slug": slug.current
}
`

export const publicationBySlugQuery = groq`
*[_type == "publication" && slug.current == $slug][0]{
  _id,
  title,
  authors[]{
    _type == "reference" => @->{
      _id,
      name,
      role,
      "slug": slug.current
    },
    _type == "externalAuthor" => {
      "name": name,
      "slug": null
    }
  },
  venue,
  year,
  abstract,
  paperUrl,
  codeUrl,
  "slug": slug.current
}
`

export const eventBySlugQuery = groq`
*[_type == "event" && slug.current == $slug][0]{
  _id,
  title,
  location,
  startDate,
  endDate,
  summary,
  description,
  poster,
  "slug": slug.current
}
`
