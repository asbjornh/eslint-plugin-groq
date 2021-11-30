import groq from "some-groq";

groq`
*[_type == "movie"]{
    _id,
    title,
    releaseDate,
    "director": crewMembers[job == "Director"][0].person->name,
    "poster": poster.asset->url
  }[0...50]
`;

groq`*[_type == "movie"]{}[0..50]`;

groq`*[_type == "movie"]{}0..50]`;

groq`*[_type == "${"movie"}"]{}[0..50]`;
