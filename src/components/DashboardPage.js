import React from "react";
import ProductForm from "./ProductForm";
import ManageUser from "./ManageUser"

const DashboardPage = () => {
    return (
        <div id="dashboard-page">
            <h1>Admin Dashbord</h1>
            <ProductForm />
            <ManageUser />
        </div>
    )
}

export default DashboardPage;
