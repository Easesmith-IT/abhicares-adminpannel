import React, { useEffect, useState } from "react";

import classes from "./Shared.module.css";
import AddBtn from "../../assets/add-icon-nobg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddSellerModal from "../../components/add-seller-modal/AddSellerModal";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import DeleteModal from "../../components/deleteModal/DeleteModal";
import Wrapper from "../Wrapper";
import SellerInfoModal from "../../components/seller-info-modal/SellerInfoModal";
import Loader from "../../components/loader/Loader";
import UnapprovedSellerModal from "../../components/unapproved-seller-modal/UnapprovedSellerModal";

const Partners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSellerInfoModalOpen, setIsSellerInfoModalOpen] = useState(false);
  const [seller, setSeller] = useState({});
  const [allSellers, setAllSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnapprovedSellerModalOpen, setIsUnapprovedSellerModalOpen] = useState(false);


  const navigate = useNavigate()

  const token = localStorage.getItem("adUx")
  const headers = {
    Authorization: token
  }

  const getAllSellers = async () => {
    try {
      if (!token) {
        navigate('/');
        return;
      }
      const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-all-seller`, { headers });
      setAllSellers(data.data);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllSellers();
  }, [])



  const handleOnChange = async (e, id) => {
    if (e.target.checked) {
      try {
        if (!token) {
          navigate('/');
          return;
        }
        const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-seller-status/${id}`, { status: true }, { headers });
        toast.success("Seller status updated");
        getAllSellers();
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        if (!token) {
          navigate('/');
          return;
        }
        const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-seller-status/${id}`, { status: false }, { headers });
        toast.success("Seller status updated");
        getAllSellers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateModal = (e, seller) => {
    e.stopPropagation();
    setSeller(seller);
    setIsUpdateModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteModal = (e, id) => {
    e.stopPropagation();
    setSeller(id);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDelete = async () => {
    try {
      if (!token) {
        navigate('/');
        return;
      }
      const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_API_URL}/delete-seller/${seller}`, { headers });
      toast.success("Seller deleted successfully");
      getAllSellers();
      setIsDeleteModalOpen(!isDeleteModalOpen);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSerach = async (e) => {
    const value = e.target.value;

    try {
      if (!token) {
        navigate('/');
        return;
      }
      const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/search-seller?search=${value}`, { headers });
      setAllSellers(data.data);
    } catch (error) {
      console.log(error);
    }
  }


  function debounce(fx, time) {
    let id = null;
    return function (data) {
      if (id) {
        clearTimeout(id);
      }
      id = setTimeout(() => {
        fx(data);
        // id = null;
      }, time);
    };
  }

  if (!token) {
    navigate('/');
    return;
  }

  const handleSellerInfoModal = (data) => {
    setSeller(data);
    setIsSellerInfoModalOpen(true);
  }

  return (
    <>
      <Wrapper>
        <div className={classes["report-container"]}>
          <div className={classes["report-header"]}>
            <h1 className={classes["recent-Articles"]}>Professionals</h1>
            <input onChange={debounce(handleSerach, 1000)} className={classes.input} type="text" placeholder="Search professionals" />
            <button onClick={() => setIsUnapprovedSellerModalOpen(true)} className={classes.button}>Unapproved Seller</button>
            <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
              <img src={AddBtn} alt="add seller" />
            </button>
          </div>

          <div className={classes["report-body"]}>
            <div className={classes["report-topic-heading"]}>
              <h3 className={classes["t-op"]}>Seller Name</h3>
              <h3 className={classes["t-op"]}>Service</h3>
              <h3 className={classes["t-op"]}>Category</h3>
              <h3 className={classes["t-op"]}>Phone</h3>
              {/* <h3 className={classes["t-op"]}>Status</h3> */}
              <h3 className={classes["t-op"]}>Update/<br />Delete</h3>
            </div>

            <div className={classes.items}>
              {!isLoading
                && allSellers.length === 0
                && <p>No sellers found</p>
              }

              {isLoading
                && allSellers.length === 0
                && <Loader />
              }
              {allSellers?.map((seller) => (
                <div key={seller._id} onClick={(e) => handleSellerInfoModal(seller)} className={classes.item1}>
                  <h3 className={classes["t-op-nextlvl"]}>{seller.name}</h3>
                  <h3 className={`${classes["t-op-nextlvl"]}`}>service</h3>
                  <h3 className={`${classes["t-op-nextlvl"]}`}>category</h3>
                  <h3 className={`${classes["t-op-nextlvl"]}`}>{seller.phone}</h3>
                  {/* <h3 onClick={(e) => e.stopPropagation()} className={`${classes["t-op-nextlvl"]}`}>
                    <input checked={seller.status} onChange={(e) => handleOnChange(e, seller._id)} type="checkbox" name="" id="" />
                    {seller.status ? "Active" : "InActive"}
                  </h3> */}
                  <h3 className={`${classes["t-op-nextlvl"]}`}>
                    <FiEdit onClick={(e) => handleUpdateModal(e, seller)} cursor={"pointer"} size={20} />
                    <MdDelete onClick={(e) => handleDeleteModal(e, seller._id)} cursor={"pointer"} size={22} color='red' />
                  </h3>

                </div>
              ))}

            </div>
          </div>
        </div>
      </Wrapper >
      {isModalOpen &&
        <AddSellerModal
          setIsModalOpen={setIsModalOpen}
          getAllSellers={getAllSellers}
        />
      }

      {isSellerInfoModalOpen &&
        <SellerInfoModal
          setIsSellerInfoModalOpen={setIsSellerInfoModalOpen}
          seller={seller}
        />
      }

      {isUpdateModalOpen &&
        <AddSellerModal
          setIsModalOpen={setIsUpdateModalOpen}
          getAllSellers={getAllSellers}
          seller={seller}
        />
      }

      {isDeleteModalOpen &&
        <DeleteModal
          setState={setIsDeleteModalOpen}
          handleDelete={handleDelete}
        />
      }
      {isUnapprovedSellerModalOpen &&
        <UnapprovedSellerModal
          setIsUnapprovedSellerModalOpen={setIsUnapprovedSellerModalOpen}
          allSellers={allSellers}
        />
      }
    </>
  );
};

export default Partners;
