import React from "react";
import AddRecipeForm from "../components/addRecipeForm";
import Layout from "../components/layout";

const App = () => (
  <>
    <Layout>
      <div style={{ paddingTop: "80px" }}>
        <AddRecipeForm />
      </div>
    </Layout>
  </>
);

export default App;
