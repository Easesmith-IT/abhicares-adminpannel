import React, { useEffect, useState } from "react";

import classes from "./Shared.module.css";
import AddUserModal from "../../components/add-user-modal/AddUserModal";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import DeleteModal from "../../components/deleteModal/DeleteModal";
import Wrapper from "../Wrapper";
import Loader from "../../components/loader/Loader";

const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const token = localStorage.getItem("adUx")
  const headers = {
    Authorization: token
  }
  const navigate = useNavigate()
  const getAllUsers = async () => {
    try {
      if (!token) {
        navigate('/');
        return
      }
      const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-all-user`, { headers });
      setAllUsers(data.data);
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, [])

  // const handleOnChange = async (e, id) => {
  //   if (e.target.checked) {
  //     try {
  //       if (!token) {
  //         navigate('/');
  //         return
  //       }
  //       const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-user-status/${id}`, { status: true }, { headers });
  //       toast.success("Seller status updated");
  //       getAllUsers();
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   else {
  //     try {
  //       if (!token) {
  //         navigate('/');
  //         return
  //       }
  //       const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-user-status/${id}`, { status: false }, { headers });
  //       toast.success("Seller status updated");
  //       getAllUsers();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const handleUpdateModal = (seller) => {
    setUser(seller);
    setIsUpdateModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteModal = (id) => {
    setUser(id);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDelete = async () => {
    try {
      if (!token) {
        navigate('/');
        return
      }
      const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_API_URL}/delete-user/${user}`, { headers });
      console.log(data);
      toast.success("User deleted successfully");
      getAllUsers();
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
        return
      }
      const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/search-user?search=${value}`, { headers });
      setAllUsers(data.data);
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

  return (
    <>
      <Wrapper>

        <div className={classes["report-container"]}>
          <div className={classes["report-header"]}>
            <h1 className={classes["recent-Articles"]}>Customers</h1>
            <input onChange={debounce(handleSerach, 1000)} className={classes.input} type="text" placeholder="Search customers" />
            {/* <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                <img src={AddBtn} alt="add product" />
              </button> */}
          </div>

          <div className={classes["report-body"]}>
            <div className={classes["report-topic-heading"]}>
              <h3 className={classes["t-op"]}>User Name</h3>
              <h3 className={classes["t-op"]}>Contact Number</h3>
              <h3 className={classes["t-op"]}>Update/Delete</h3>
            </div>

            <div className={classes.items}>
              {!isLoading
                && allUsers?.length === 0
                && <p>No users found</p>
              }

              {isLoading
                && allUsers?.length === 0
                && <Loader />
              }
              {allUsers?.map((user) => (
                <div key={user._id} className={classes.item1}>
                  <h3 className={classes["t-op-nextlvl"]}>{user.name}</h3>
                  <h3 className={classes["t-op-nextlvl"]}>{user.phone}</h3>
                  <h3 className={`${classes["t-op-nextlvl"]}`}>
                    <FiEdit onClick={() => handleUpdateModal(user)} cursor={"pointer"} size={20} />
                    <MdDelete onClick={() => handleDeleteModal(user._id)} cursor={"pointer"} size={22} color='red' />
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
      {isModalOpen &&
        <AddUserModal
          setIsModalOpen={setIsModalOpen}
          getAllUsers={getAllUsers}
        />
      }

      {isUpdateModalOpen &&
        <AddUserModal
          setIsModalOpen={setIsUpdateModalOpen}
          user={user}
          getAllUsers={getAllUsers}
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

export default Customers;
