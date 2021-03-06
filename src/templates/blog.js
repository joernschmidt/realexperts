import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import BlogPostTeaser from '../components/BlogPostTeaser';
import favicon from '../img/favicon.ico';
import arrowLeft from '../img/icons/arrow-left.svg';
import arrowRight from '../img/icons/arrow-right.svg';
import Layout from '../components/layout';

export default class BlogIndexPage extends React.Component {
  render() {
    const {data} = this.props;

    // only consider the first four related posts on the front page as top posts
    const relatedPosts = data.markdownRemark.fields.relatedPosts;
    const topPosts = relatedPosts ? relatedPosts.slice(0, 4) : [];
    // exclude posts from `all posts` which are already in top posts
    const posts = data.allMarkdownRemark.edges;
      // .filter(({node: post}) => {
      //   return !topPosts.find(topPost => topPost.id === post.id);
      // });

    const {limit, skip, currentPage, numPages} = this.props.pageContext;

    console.log(limit, skip, currentPage, numPages);

    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;
    const prevPage = currentPage - 1 === 1 ? '' : (currentPage - 1).toString();
    const nextPage = (currentPage + 1).toString();

    return (
      <Layout noHeader={true}>
        <section className="blog" lang="de">
          <Helmet title={`Blog | ${data.settings.global.title}`} link={[
            {rel: 'shortcut icon', type: 'image/ico', href: `${favicon}`},
          ]}/>
          <div className="page-content">
            {isFirst &&
            <div className="content-block-wrapper">
              { topPosts.length > 0 &&
              <div className="content-block">
                <h2>Top Beiträge</h2>
                <div className="top-posts">
                  {topPosts.map((topPost, key) => (
                    <BlogPostTeaser key={topPost.id} post={topPost} type={key === 0 ? 'featured' : 'top'}/>
                  ))}
                </div>
              </div>
              }
            </div>
            }
            <div className="content-block-wrapper">
              <div className="content-block">
                <h2>Alle Beiträge</h2>
                <div className="all-posts">
                  {posts.map(({node: post}) => (
                    <BlogPostTeaser key={post.id} post={post} type='normal'/>
                  ))}
                </div>
                <ul className="pagination">
                  {!isFirst && (
                    <Link to={`/blog/${prevPage}`} rel="prev" className="pagination-prev"> <img src={arrowLeft} alt="Previous"/> </Link>
                  )} {Array.from({length: numPages}, (_, i) => (
                  <li className="pagination-item" key={`pagination-number${i + 1}`}>
                    <Link to={`/blog/${i === 0 ? '' : i + 1}`} className={i + 1 === currentPage
                      ? 'pagination-item-link active'
                      : 'pagination-item-link'}>
                      {i + 1}
                    </Link>
                  </li>
                ))} {!isLast && (
                  <Link className="pagination-next" to={`/blog/${nextPage}`} rel="next"> <img src={arrowRight} alt="Next"/> </Link>
                )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

BlogIndexPage.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
    markdownRemark: PropTypes.shape({
      id: PropTypes.string,
      fields: PropTypes.shape({
        relatedPosts: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          excerpt: PropTypes.string,
          frontmatter: PropTypes.shape({
            title: PropTypes.string,
            date: PropTypes.string,
            tags: PropTypes.arrayOf(PropTypes.string),
          }),
          fields: PropTypes.shape({
            slug: PropTypes.string,
            image: PropTypes.object,
            category: PropTypes.object,
          }),
        })),
      }),
    }),
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export const pageQuery = graphql`
  query BlogIndexQuery($skip: Int!, $limit: Int!) {
      settings: settingsJson(id: {eq: "general-settings"}) {
      global {
        title
        url
      }
    }
    # Query front page for related posts used as top posts
    markdownRemark(fields: { slug: { eq: "/index/" }}) {
      id
      fields {
        relatedPosts {
          id
          # TODO: Should we use _description_ instead?
          excerpt(pruneLength: 140)
          frontmatter {
            title
            date
            tags
          }
          fields {
            slug
            category {
              fields {
                  slug
              }
              frontmatter {
                  title
              }
            }
            image {
              id
              childImageSharp {
                fluid (maxWidth: 850) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "blog-post" } }}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(pruneLength: 140)
          id
          fields {
            slug
            category {
                fields {
                    slug
                }
                frontmatter {
                    title
                }
            }
            image {
              childImageSharp {
                fluid(maxWidth: 630) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          frontmatter {
            title
            templateKey
            tags
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
