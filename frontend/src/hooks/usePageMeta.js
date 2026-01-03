import { useEffect } from "react";

function upsertMeta(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
}

function upsertCanonical(href) {
    let tag = document.querySelector(`link[rel="canonical"]`);
    if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", "canonical");
        document.head.appendChild(tag);
    }
    tag.setAttribute("href", href);
}

export function usePageMeta({ title, robots, canonicalPath }) {
    useEffect(() => {
        if (title) document.title = title;
        if (robots) upsertMeta("robots", robots);
        if (canonicalPath) {
            upsertCanonical(`https://healthlexmed.com${canonicalPath}`);
        }
    }, [title, robots, canonicalPath]);
}
