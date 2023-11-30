import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";
import AddBtn from "../../assets/add-icon-nobg.png";
import axios from "axios";
import AddSellerModal from "../../components/add-seller-modal/AddSellerModal";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import DeleteModal from "../../components/deleteModal/DeleteModal";

const Partners = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [seller, setSeller] = useState({});
  const [allSellers, setAllSellers] = useState([]);

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };

  const getAllSellers = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-seller`);
      console.log(data);
      setAllSellers(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSellers();
  }, [])

  const handleOnChange = async (e, id) => {
    if (e.target.checked) {
      try {
        const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/update-seller-status/${id}`, { status: true });
        toast.success("Seller status updated");
        getAllSellers();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/update-seller-status/${id}`, { status: false });
        toast.success("Seller status updated");
        getAllSellers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateModal = (e, seller) => {
    // e.stopPropagation();
    setSeller(seller);
    setIsUpdateModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteModal = (e, id) => {
    // e.stopPropagation();
    setSeller(id);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/delete-seller/${seller}`);
      toast.success("Seller deleted successfully");
      getAllSellers();
      setIsDeleteModalOpen(!isDeleteModalOpen);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <Header onClick={toggleMenuHandler} />

        <div className={classes["main-container"]}>
          <div
            className={`${classes.navcontainer} ${showMenu ? classes.navclose : ""
              }`}
          >
            <SideNav />
          </div>

          {/* <div className={classes.partners}>
          <Link>
            <div>Partner -1</div>
          </Link>
          <Link>
            <div>Partner -2</div>
          </Link>
          <Link>
            <div>Partner -3</div>
          </Link>
        </div> */}
          <div className={classes["report-container"]}>
            <div className={classes["report-header"]}>
              <h1 className={classes["recent-Articles"]}>Sellers</h1>
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
                <h3 className={classes["t-op"]}>Status</h3>
                <h3 className={classes["t-op"]}>Update/<br/>Delete</h3>
              </div>

              <div className={classes.items}>
                {allSellers?.map((seller) => (
                  <div key={seller._id} className={classes.item1}>
                    <h3 className={classes["t-op-nextlvl"]}>{seller.name}</h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>service</h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>category</h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>{seller.phone}</h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>
                      <input checked={seller.status} onChange={(e) => handleOnChange(e, seller._id)} type="checkbox" name="" id="" />
                      {seller.status ? "Active" : "InActive"}
                    </h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>
                      <FiEdit onClick={(e) => handleUpdateModal(e, seller)} cursor={"pointer"} size={20} />
                      <MdDelete onClick={(e) => handleDeleteModal(e, seller._id)} cursor={"pointer"} size={22} color='red' />
                    </h3>

                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div >
      {isModalOpen &&
        <AddSellerModal
          setIsModalOpen={setIsModalOpen}
          getAllSellers={getAllSellers}
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
    </>
  );
};

export default Partners;
