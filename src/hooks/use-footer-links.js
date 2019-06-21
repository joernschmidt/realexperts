import { graphql, useStaticQuery } from 'gatsby';

export const useFooterLinks = () => {
  const {settings, mobileImage, desktopImage} = useStaticQuery(
    graphql`
      query {
        settings: settingsJson {
          footerlinks {
            menutitle
            links {
              link
              linktitle
            }
          }
        }
        mobileImage:file(relativePath: { eq: "logo_esf_sachsen_smartphone.png" }) {
          childImageSharp {
            fluid(maxWidth: 480, quality: 100) {
              src
            }
          }
        }
        desktopImage:file(relativePath: { eq: "logo_esf_sachsen.png" }) {
          childImageSharp {
            fluid(maxWidth: 2000, quality: 100) {  
              src         
            }
          }
        }
      }
    `,
  );
  return {settings, mobileImage, desktopImage};
};