import axioss from "./axios";

// api get product by page
const fecthAll = (page, size) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(
    `/product/get-by-pages?page=${page}&size=${size}`,
    config
  );
};

const getAllPO = (page, size) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(`/po/get-all-by-page?page=${page}&size=${size}`, config);
}

const notify = () => {
  // return axioss.post('/api/v1/order/import')
};
// api add user
const postCreateUser = (
  fullName,
  email,
  phoneNumber,
  password,
  status,
  roles
) => {
  return axioss.post(
    "/user/add",
    {
      fullName,
      email,
      phoneNumber,
      password,
      status,
      roles: Array.isArray(roles) ? roles : [roles],
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api get user
const getUserAdmin = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/user/get-all", config);
};

// api login
const loginApi = (email, password) => {
  return axiosss.post("/api/login", { email, password });
};

// api login
const loginAdmin = (email, password) => {
  return axioss.post(
    "/user/login",
    { email, password },
    { withCredentials: true }
  );
};

// api get role
const role = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/role/get-all", config);
};

// api send otp
const sendOTP = (email) => {
  return axioss.post(`/user/forgot-password/sent-otp?email=${email}`);
};

// api verify otp
const verifyAPI = (opt, email, password, rePassword) => {
  return axioss.post(
    `/user/forgot-password/verify?OTP=${opt}&email=${email}&newPassword=${password}&rePassword=${rePassword}`
  );
};

// api delete user
const deleteUser = (email) => {
  return axioss.put(`/user/delete/${email}`, null, {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
};

// api update user
const updateUser = (email, fullName, phoneNumber, roles) => {
  return axioss.put(
    `/user/update/${localStorage.getItem("emailEdit")}`,
    {
      email,
      fullName,
      phoneNumber,
      roles: Array.isArray(roles) ? roles : [roles],
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api resetpassword
const resetPassword = (oldPassword, newPassword) => {
  return axioss.post(
    `/user/reset-password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
    null,
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api get user by email
const getUserByEmail = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(
    `/user/get-by-id?id=${localStorage.getItem("email")}`,
    config
  );
};


// api get all product
const getAllProduct = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/product/get-all", config);
};


// api search product
const searchProduct = (keyword, property, pageIndex, pageSize) => {
  return axioss.post(
    "/product/search-by-keyword",
    {
      keyword: Array.isArray(keyword) ? keyword : [keyword],
      property,
      pageIndex,
      pageSize,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api add po
const createPo = (
  contractNumber,
  poNumber,
  quantity,
  beginAt,
  endAt,
  contractWarrantyExpirationDate,
  warrantyExpirationDate,
  note
) => {
  return axioss.post(
    "/po/add",
    {
      contractNumber,
      poNumber,
      quantity,
      beginAt,
      endAt,
      contractWarrantyExpirationDate,
      warrantyExpirationDate,
      note
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api get po
const getPo = () => {
  const config = {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  };
  return axioss.get("/po/get-all", config);
};

// api update po
const updatePo = (
  contractNumber,
  poNumber,
  quantity,
  beginAt,
  endAt,
  contractWarrantyExpirationDate,
  warrantyExpirationDate,
  note
) => {
  return axioss.put(
    `/po/update/${localStorage.getItem("po")}`,
    {
      contractNumber,
      poNumber,
      quantity,
      beginAt,
      endAt,
      contractWarrantyExpirationDate,
      warrantyExpirationDate,
      note
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api get po detail by page
const fecthAllPoDetail = (page, size) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(
    `/po-detail/get-all-by-page?page=${page}&size=${size}`,
    config
  );
};

// api get all po detail
const getAllPoDetail = () => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get("/po-detail/get-all", config);
};

// api update product
const updateProduct = (productId, productName, imagesBase64, productGroup) => {
  return axioss.put(
    `/product/update/${productId}`,
    { productId, productName, imagesBase64, productGroup },
    {
      headers: {
        // "Content-Type": "multipart/form-data",
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api add product
const addProduct = (productId, productName, imagesBase64, productGroup) => {
  return axioss.post(
    "/product/add",
    {
      productId,
      productName,
      imagesBase64: Array.isArray(imagesBase64) ? imagesBase64 : [imagesBase64],
      productGroup,
    },
    {
      headers: {
        // "Content-Type": "multipart/form-data",
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api search po detail
const searchPODetail = (keyword, property, pageIndex, pageSize) => {
  return axioss.post(
    "/po-detail/search-by-keyword",
    {
      keyword: Array.isArray(keyword) ? keyword : [keyword],
      property,
      pageIndex,
      pageSize,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// api update po detail
const updatePoDetail = (
  poDetailId,
  bbbgNumber,
  importDate,
  repairCategory,
  priority,
  repairStatus,
  exportPartner,
  kcsVT,
  warrantyPeriod,
  bbbgNumberExport,
  note
) => {
  return axioss.put(
    `/po-detail/update/${poDetailId}`,
    {
      poDetailId,
      bbbgNumber,
      importDate,
      repairCategory,
      priority,
      repairStatus,
      exportPartner,
      kcsVT,
      warrantyPeriod,
      bbbgNumberExport,
      note,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

// apo show statistical
const showStatistical = (poNumber) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(`/po/${poNumber}`, config);
};

// api export by po
const exportByPO = (poNumber) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(`/po-detail/getByPo/${poNumber}`, config);
}

// api import po-detail
const importPODetail = (file) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      email: localStorage.getItem("email"),
    },
  };
  return axioss.post("/po-detail/upload/import", file, config);
}

// api update status po-detail
const updateStatusPoDetail = (file) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      email: localStorage.getItem("email"),
    },
  };
  return axioss.post("/po-detail/upload/update", file, config);
}

// api delete po detail
const deletePODetail = (id) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.post(`/po-detail/deleteByID?id=${id}`,null, config);
}

const searchSerialNumber = (file) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      email: localStorage.getItem("email"),
    },
  };
  return axioss.post("/po-detail/search/serialNumber", file, config);
}

const searchPO = (keyword, property, pageIndex, pageSize) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.post(
    "/po/search-by-keyword",
    {
      keyword: Array.isArray(keyword) ? keyword : [keyword],
      property,
      pageIndex,
      pageSize,
    },
    config
  );
}

const checkBarcode = (serialNumber) => {
  const config = {
    headers: {
      email: localStorage.getItem("email"),
    },
  };
  return axioss.get(`/po-detail/serialNumber?serialNumber=${serialNumber}`, config);
}

const getHistory = (start, end) => {
  return axioss.get(
    `/history/get-by-created?start=${start}&end=${end}`,
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
}

const downloadHistory = (filePath) => {
  return axioss.get(`/history/download?filePath=${filePath}`, {
    responseType: "arraybuffer",
    headers: {
      email: localStorage.getItem("email"),
    },
  });
}

const writeAllNK = (list) => {
  return axioss.post(`/po-detail/update/import-date?list=${list}`,null, {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
}

const writeAllXK = (list) => {
  return axioss.post(`/po-detail/update/export-partner?list=${list}`, null, {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
}

const getImages = (id) => { 
  return axioss.get(`/product/get-by-id?id=${id}`, {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
}

const saveAllRepair = (repariHistory) => {
  return axioss.post("/repair-history/add-all", repariHistory, {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
}

const searchRepairHistory = (keyword, property, pageIndex, pageSize) => {
  return axioss.post(
    "/repair-history/search-by-list-keywords",
    {
      keyword: Array.isArray(keyword) ? keyword : [keyword],
      property,
      pageIndex,
      pageSize,
    },
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const relateRepairHistory = (poDetailId, id) => {
  return axioss.get(
    `/repair-history/get-related-data?poDetailId=${poDetailId}&id=${id}`,
    {
      headers: {
        email: `${localStorage.getItem("email")}`,
      },
    }
  );
};

const getProductName = () => {
  return axioss.get("/product/get-all-product-name", {
    headers: {
      email: `${localStorage.getItem("email")}`,
    },
  });
}

export {
  fecthAll,
  notify,
  loginApi,
  postCreateUser,
  loginAdmin,
  role,
  getUserAdmin,
  sendOTP,
  verifyAPI,
  deleteUser,
  updateUser,
  resetPassword,
  getUserByEmail,
  getAllProduct,
  searchProduct,
  createPo,
  getPo,
  updatePo,
  fecthAllPoDetail,
  getAllPoDetail,
  updateProduct,
  addProduct,
  searchPODetail,
  updatePoDetail,
  showStatistical,
  exportByPO,
  importPODetail,
  updateStatusPoDetail,
  deletePODetail,
  searchSerialNumber,
  searchPO,
  getAllPO,
  checkBarcode,
  getHistory,
  downloadHistory,
  writeAllNK,
  writeAllXK,
  getImages,
  saveAllRepair,
  searchRepairHistory,
  relateRepairHistory,
  getProductName,
};
