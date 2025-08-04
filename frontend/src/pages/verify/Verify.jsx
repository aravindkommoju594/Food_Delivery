import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import {StoreContext} from '../../context/StoreContext'
import axios from 'axios';

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
const success = searchParams.get("success");
const orderId = searchParams.get("orderId");
const navigate=useNavigate()

const {url}=useContext(StoreContext)

const verifyPayment = async () => {
  const response = await axios.post(url + "/api/order/verify", { success, orderId }); // Added orderId to the object
  if (response.data.success) {
    navigate('/myorders')

  }
  else {
    navigate('/')
  }
}

useEffect(()=> {
  verifyPayment();
},[])



console.log(success,orderId);
  return (
    <div>
    <div className="verify">
      <div className="spinner"></div>
    </div>
    </div>
  )
}

export default Verify