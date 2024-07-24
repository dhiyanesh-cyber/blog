import React from 'react'
import { remark } from 'remark';
import html from 'remark-html';

const markDown: React.FC = async () => {
    const content: string = "- This is first point\n - This is second point";
    const processedContent = await remark()
        .use(html)
        .process(content);
    const contentHtml = processedContent.toString();
    return (
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    )
}

export default markDown