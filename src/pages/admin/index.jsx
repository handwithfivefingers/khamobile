import React from 'react'
import { Panel, Row, Col, ButtonGroup, Button } from 'rsuite'
import Copyright from 'component/UI/Copyright'
import AdminLayout from 'component/UI/AdminLayout'
import { LocalBusinessJsonLd } from 'next-seo'

const Admin = () => {
  return (
    <>
      <LocalBusinessJsonLd
        type="Store"
        id="https://khamobile.vn"
        name="Cửa hàng Kha Mobile"
        description="Dave's latest department store in San Jose, now open"
        url="https://www.google.com/maps/place/Kha+mobile+-+gi%C3%A1+t%E1%BB%91t+m%E1%BB%97i+ng%C3%A0y/@10.7982922,106.7091931,17z/data=!3m1!4b1!4m13!1m7!3m6!1s0x317528affb2334a7:0x9ad5b46a56df7665!2zMjIwLzlBIFjDtCBWaeG6v3QgTmdo4buHIFTEqW5oLCBQaMaw4budbmcgMjEsIELDrG5oIFRo4bqhbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!3b1!8m2!3d10.798767!4d106.712177!3m4!1s0x317529700ef137cf:0x43ea80c21adbb00e!8m2!3d10.7982869!4d106.7113818?hl=vi-VN"
        telephone="+14088717984"
        address={{
          streetAddress: '220/9A Xô Viết Nghệ Tĩnh',
          addressLocality: 'Phường 21, Quận Bình Thạnh',
          addressRegion: 'Thành Phố Hồ Chí Minh',
          postalCode: '717455',
          addressCountry: 'Việt Nam',
        }}
        geo={{
          latitude: '10.798315590322954',
          longitude: '106.71140159606115',
        }}
        images={[
          'https://lh3.ggpht.com/p/AF1QipO_ysrKjenYzUaRajImQuUplPx06qrNJXucUjzI=s512',
          'https://lh5.googleusercontent.com/p/AF1QipNa-FmkR6eBswQOBRrHhQxt-VCr8ZOxHcov_u8r=s406-k-no',
        ]}
        // sameAs={['www.company-website-url1.dev', 'www.company-website-url2.dev', 'www.company-website-url3.dev']}

        openingHours={[
          {
            opens: '09:00',
            closes: '21:30',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            validFrom: '2019-12-23',
            validThrough: '2029-12-12',
          },
          // {
          //   opens: '14:00',
          //   closes: '20:00',
          //   dayOfWeek: 'Sunday',
          //   validFrom: '2019-12-23',
          //   validThrough: '2020-04-02',
          // },
        ]}
        rating={{
          ratingValue: '5',
          ratingCount: '6',
        }}
        review={[
          {
            author: 'Ngoc Duong',
            datePublished: '20022-12-04',
            name: 'A masterpiece of literature',
            reviewBody: 'cam thay ok , qua day mua yen tam , se ung ho tiep',
            reviewRating: {
              bestRating: '5',
              worstRating: '1',
              reviewAspect: 'Ambiance',
              ratingValue: '4',
            },
          },
        ]}

        // makesOffer={[
        //   {
        //     priceSpecification: {
        //       type: 'UnitPriceSpecification',
        //       priceCurrency: 'VND',
        //       price: '1000000-100000000',
        //     },
        //     itemOffered: {
        //       name: 'Motion Design Services',
        //       description: 'We are the expert of animation and motion design productions.',
        //     },
        //   },
        // ]}
        // areaServed={[
        //   {
        //     geoMidpoint: {
        //       latitude: '41.108237',
        //       longitude: '-80.642982',
        //     },
        //     geoRadius: '1000',
        //   },
        //   {
        //     geoMidpoint: {
        //       latitude: '51.108237',
        //       longitude: '-80.642982',
        //     },
        //     geoRadius: '1000',
        //   },
        // ]}
        // action={{
        //   actionName: 'potentialAction',
        //   actionType: 'ReviewAction',
        //   target: 'https://www.example.com/review/this/business',
        // }}
      />
      <Panel header={<h3 className="title">Dashboard</h3>}>
        <Row gutter={30} className="dashboard-header"></Row>

        <Row gutter={30}>
          <Col xs={16}></Col>
          <Col xs={8}></Col>
        </Row>

        <Row gutter={30}>
          <Col xs={16}></Col>
          <Col xs={8}></Col>
        </Row>
        <Copyright />
      </Panel>
    </>
  )
}

// Admin.Layout = CommonLayout;
Admin.Admin = AdminLayout
export default Admin
