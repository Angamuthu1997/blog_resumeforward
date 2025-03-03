import {formatISO9075} from "date-fns";
import { useEffect } from "react";
import {Link} from "react-router-dom";

export default function Post({id,title,summary,cover,content,createdAt,author}) {

  useEffect(() => {
    console.log("000000000000",author);
  },[]);

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${id}`}>
          <img src={'http://localhost:4000/'+cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}