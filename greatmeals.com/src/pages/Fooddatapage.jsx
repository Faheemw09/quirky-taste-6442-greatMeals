import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  Grid,
  GridItem,
  Box,
  useColorModeValue,
  Heading,
  Divider,
  Link,
  Spinner,
  Text,
  Button,
  Select,
  InputGroup,
  Input,
  InputRightAddon,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { SortFilter } from "./Filterpage";
import Navbar from "../components/Navbar";
import Footer from "../landingpages/Footer";

import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
} from "@chakra-ui/icons";
import { useSearchParams } from "react-router-dom";
const getPage=(val=1)=>{
  let PageNumber=Number(val)
  if(typeof PageNumber!="number"){
    PageNumber=1
  }if(PageNumber<=0){
    PageNumber=1
  }
  return PageNumber
}
export const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("");
  let[searchparam,setSearchparam]=useSearchParams()
  // const[page,setPage]=useState(1)
  const[page,setPage]=useState(getPage(searchparam.get("page")))
  const [searchquery, setSearchquery] = useState("");
 
  const[total,setTotal]=useState(0)
  let limit=8
  let lastpage=Math.ceil(total/limit)
  let sort = "price";
  
  const getData = () => {
    const params = searchquery ? { q: searchquery } : {};
    let url;
    if (order) {
      url = `http://localhost:8080/Fooddata?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
    } else {
      url = `http://localhost:8080/Fooddata?_page=${page}&_limit=${limit}`;
    }
    setLoading(true);

    axios
      .get(url, {
        params,
      })
      .then((res) => {
        const updatedFood = res.data.map((restaurant) => ({
          ...restaurant,
          quantity: 1, // add a quantity field with default value of 1
        }))
        console.log(res.data);
        console.log("kkk",updatedFood);
        setData(updatedFood);
        setTotal(Number(res.headers.get("X-Total-Count")))
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [order,page,searchquery]);

  // useEffect(()=>{
  // getData(searchquery)
  // },[searchquery])


  useEffect(()=>{
    setSearchparam({page:page})
  },[page])
  // useEffect(()=>{
  //   if(order){
  //     if(order=="asc"){
  //         const arr=[...data].sort((a,b)=>a.price - b.price)
  //         setData([...arr])
  //     }
  //     if(order=="desc"){
  //         const arr=[...data].sort((a,b)=>b.price - a.price)
  //         setData([...arr])
  //     }
  //   }
  // },[order])

  return (
    <div>
      {/* <Link to='/products'></Link> */}
      {/* <Heading>Products For You</Heading> */}
      <Navbar />

      {/* <Divider border={"0.5px solid gray.600"} mt={"6px"} mb={"15px"} /> */}

      {/* <Box w={"1100px"} h={"100%"}  ml={"100px"} display={"grid"} gridTemplateColumns={"repeat(2,0px)"} > */}

      {/* <Box w={"350px"} h={"820px"}  border={"1px solid #E7EEFF"} borderRadius={"10px"} > <SortFilter/> </Box> */}
      <div
        style={{
          width: "700px",
          height: "50Px",
          display: "flex",
          // border: "1px solid #a8b3ab",
          margin: "auto",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop:"15px"
        }}
      >
        <div
          style={{
            width: "400px",
            height: "50Px",
            display: "flex",
            paddingTop: "10px",
            justifyContent: "space-around",
          }}
        >
          <div>
            <Text fontSize={"md"}>Sort By :</Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "320px",
              
            }}
          >
            <Button
              isDisabled={order == "desc"}
              onClick={() => setOrder("desc")}
              backgroundColor="#fcec52"
              size="sm"
              value={"desc"}
            >
              Price (High to Low)
            </Button>

            <Button
              isDisabled={order == "asc"}
              onClick={() => setOrder("asc")}
              backgroundColor="#fcec52"
              size="sm"
              value={'asc'}
            >
              Price (Low to High)
            </Button>
          </div>
        </div>
        <Box>
          <InputGroup>
            <Input
              placeholder="Search here"
              height="40px"
              width="200px"
              type={"text"}
              HiOutlineSearch
              onChange={(e) => setSearchquery(e.target.value)}
            />
            <InputRightAddon
              pointerEvents=""
              backgroundColor="#fcec52"
              children={<SearchIcon color="white.300" />}
            />
          </InputGroup>
        </Box>
       
      </div>

    
      <Divider border={"0.5px solid gray.600"} mt={"15px"} mb={"15px"} />
      {loading ? (
        <Spinner   thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl' />
      ) : (
        <Box
          w={"990px"}
          h={"100%"}
          gap="10px"
          border={"1px solid #E7EEFF"}
          marginLeft="150px"
          borderRadius={"10px"}
        >
          <Grid gap={"20px"} gridTemplateColumns="repeat(4,230px)" margin={"auto"}>
            {data?.map((ele) => {
              return (
              <GridItem key={ele.id}>
                <ProductCard
                  title={ele.rname}
                  image={ele.imgdata}
                  price={ele.price}
                  quantity={ele.quantity }
                  category={ele.category}
                  rat={ele.rating}
                  address={ele. address}
                  id={ele.id}
                />
              </GridItem>
              )
              })}
          </Grid>
        </Box>
      )}
      {/* </Box> */}
      {/* ******************pagination***************88 */}
      <br/>
      <br/>
<div style={{display:"flex",justifyContent:"space-around", margin:"auto", width:"200px" ,alignItems:"center"}}>
  <Button   backgroundColor="#fcec52" isDisabled={page==1} onClick={()=>setPage(page-1)}>prev</Button>
  <p>{page}</p>
  <Button  backgroundColor="#fcec52" isDisabled={page==lastpage} onClick={()=>setPage(page+1)}>next</Button>
  </div>

      
      <br />
      <br />
      <Footer />
    </div>
  );
};
