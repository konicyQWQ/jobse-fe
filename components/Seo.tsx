import Head from 'next/head'

type SeoProps = {
  title: string;
  image?: string;
  description?: string;
}

const OurSiteUrl = "http://jobse.com";
const OurSiteName = "在线求职垂直搜索引擎";

export default function Seo(props: SeoProps) {
  const { title, image, description } = props;

  return (
    <Head>
      <title>{props.title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={OurSiteUrl} />
      <meta property="og:site_name" content={OurSiteName} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}