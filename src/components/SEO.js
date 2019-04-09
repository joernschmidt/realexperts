import path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import * as config from '../../gatsby-config';

const getSchemaOrgJSONLD = ({
                                isBlogPost,
                                url,
                                title,
                                image,
                                description,
                                datePublished,
                            }) => {
    const schemaOrgJSONLD = [
        {
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            url,
            name: title,
            alternateName: config.siteMetadata.title.siteMetadata.title,
        },
    ];

    return isBlogPost
        ? [
            ...schemaOrgJSONLD,
            {
                '@context': 'https://khalilstemmler.com',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        item: {
                            '@id': url,
                            name: title,
                            image,
                        },
                    },
                ],
            },
            {
                '@context': 'https://khalilstemmler.com',
                '@type': 'BlogPosting',
                url,
                name: title,
                alternateName: config.siteMetadata.title,
                headline: title,
                image: {
                    '@type': 'ImageObject',
                    url: image,
                },
                description,
                author: {
                    '@type': 'Person',
                    name: 'Khalil Stemmler',
                },
                publisher: {
                    '@type': 'Organization',
                    url: 'https://khalilstemmler.com',
                    logo: config.siteMetadata.logo,
                    name: 'Christoph Rauhut',
                },
                mainEntityOfPage: {
                    '@type': 'WebSite',
                    '@id': config.url,
                },
                datePublished,
            },
        ]
        : schemaOrgJSONLD;
};

const SEO = ({ postData, postImage, isBlogPost, author }) => {
    const postMeta = postData || {};

    const title = postMeta.title || config.siteMetadata.title || postMeta.frontmatter.title;
    console.log(title);
    const description =
        postMeta.description || postData.excerpt || postData.frontmatter.description || config.description;
    const image = `${postImage}` || config.image;
    const slug = postMeta.slug;
    const url = postMeta.slug
        ? `${config.siteMetadata.siteUrl}${postMeta.slug}`
        : config.siteMetadata.siteUrl;
    const datePublished = isBlogPost ? postMeta.date : false;

    const schemaOrgJSONLD = getSchemaOrgJSONLD({
        isBlogPost,
        url,
        title,
        image,
        description,
        datePublished,
    });

    return (
        <Helmet title={title}>
            {/* General tags */}
            <meta name="description" content={description} />
            <meta name="image" content={image} />

            {/* Schema.org tags */}
            <script type="application/ld+json">
                {JSON.stringify(schemaOrgJSONLD)}
            </script>

            {/* OpenGraph tags */}
            <meta property="og:url" content={url} />
            {isBlogPost ? <meta property="og:type" content="article" /> : null}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={author} /> //TO-DO wenn kein blog post author= Christoph
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

SEO.propTypes = {
    isBlogPost: PropTypes.bool,
    postData: PropTypes.shape({
        frontmatter: PropTypes.any,
        excerpt: PropTypes.any,
    }).isRequired,
    postImage: PropTypes.string,
    author: PropTypes.string,
};

SEO.defaultProps = {
    isBlogPost: false,
    postImage: null,
};

export default SEO;
