import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(),'posts');

//get post data
export function getSortedPostsData(){
    //post file names
    const fileNames = fs.readdirSync(postsDirectory)

    const allPostsData = fileNames.map(fileName =>{
        //remove .md from file names
        const id = fileName.replace(/\.md$/,"");
        const fullPath = path.join(postsDirectory,fileName);
        const fileContent = fs.readFileSync(fullPath,'utf-8');

        //parse metadata with gray-matter
        const matterRslt= matter(fileContent);

        return {
            id,
            ...matterRslt.data as {date: string; title : string}
        }
    })
    //Sort by Date
    return allPostsData.sort((a,b)=>{
        if(a.date<b.date){
            return 1
        } else return -1
    })
}

//get post ids
export function getAllPostIds(){
    //post file names
    const fileNames =fs.readdirSync(postsDirectory)
    return fileNames.map(fileName =>{
        return {
            params : {
                id: fileName.replace(/\.md/,'')
            }
        }
    })
}

export async function getPostData(id : string){
    const fullPath = path.join(postsDirectory,`${id}.md`)
    const fileContent = fs.readFileSync(fullPath,'utf-8')

    //parse metadata with gray-matter
    const matterRslt = matter(fileContent)

    //convert markdown to HTML
    const processedContent = await remark()
    .use(remarkHtml)
    .process(matterRslt.content)

    const contentHtml = processedContent.toString()
    //console.log('server:'+contentHtml);
    
    return {
        id,
        contentHtml,
        ...(matterRslt.data as {date: string, title: string})
    }
}
