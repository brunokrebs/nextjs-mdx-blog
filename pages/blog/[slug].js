import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import config from '../../config'

const postsDirectory = config.postsDirectory

const PostPage = ({ frontMatter: { title, date }, mdxSource }) => {
    return (
        <>
            <a href='/'>Back</a>
            <div className='post'>
                <div className="data">
                    <h1 className='title'>{title}</h1>
                    <p className='date'>{date}</p>
                </div>
                <div className="content">
                    <MDXRemote {...mdxSource} />
                </div>
            </div>
        </>
    )
  }
  
  const getStaticPaths = async () => {
    const files = fs.readdirSync(postsDirectory)
  
    const paths = files.map(filename => ({
      params: {
        slug: filename.replace('.mdx', '')
      }
    }))
  
    return {
      paths,
      fallback: false
    }
  }
  
    const getStaticProps = async ({ params: { slug } }) => {
    const markdownWithMeta = fs.readFileSync(path.join('posts',
      slug + '.mdx'), 'utf-8')
  
    const { data: frontMatter, content } = matter(markdownWithMeta)
    const mdxSource = await serialize(content)
  
    return {
      props: {
        frontMatter,
        slug,
        mdxSource
      }
    }
  }
  
  export { getStaticProps, getStaticPaths }
  export default PostPage