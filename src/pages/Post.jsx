import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { marked } from "marked";

export default function Post() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [content, setContent] = useState("");

  useEffect(() => {
    import(`../posts/${lang}/${slug}.md`)
      .then((res) => fetch(res.default))
      .then((res) => res.text())
      .then((text) => setContent(marked.parse(text)))
      .catch(() => setContent("# Post Not Found"));
  }, [slug, lang]);

  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
