import { Button, Input, Layout, Drawer, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Lov_Data } from "../../utils/Lov";
import axios from "axios";
import "./Dashboard.scss";

function Dashboard() {
  const { Header, Content } = Layout;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedOption, setSelectedOption] = useState(undefined);
  const [updateOption, setUpdateOption] = useState({ id: "", value: "" });
  const [selectedArray, setSelectedArray] = useState([]);
  const [remainingArray, setRemainingArray] = useState(Lov_Data);

  //Whenever we are updating selectedArray this useEffect will render
  useEffect(() => {
    const filteredVal = remainingArray.filter(
      (item) => !selectedArray.includes(item)
    );
    setRemainingArray(filteredVal);
    setSelectedOption(undefined);
  }, [selectedArray]);

  //Whenever we are updating updateOption this useEffect will render
  useEffect(() => {
    const filteredVal = selectedArray.filter(
      (item) => item !== updateOption?.value
    );
    filteredVal.splice(updateOption?.id, 1, updateOption?.value);
    setSelectedArray(filteredVal.filter((item) => item !== "" && item));
    setRemainingArray(Lov_Data.filter((item) => !filteredVal.includes(item)));
  }, [updateOption]);

  //Add multiple dropdown
  const addDropdown = () => {
    if (selectedOption === undefined) {
      return;
    }
    if (selectedOption !== "" && !selectedArray.includes(selectedOption)) {
      setSelectedArray([...selectedArray, selectedOption]);
    } else {
      message.error(`${selectedOption}' is already exists`);
    }
  };

  //Save the segment it's sends data to server
  const saveSegment = () => {
    let selectedData = selectedArray.map((item) => {
      return {
        [item]: `${
          item === "first_name"
            ? "First Name"
            : item === "last_name"
            ? "Last Name"
            : item === "gender"
            ? "Gender"
            : item === "age"
            ? "Age"
            : item === "city"
            ? "City"
            : item === "state"
            ? "State"
            : item === "account_name" && "Account Name"
        }`,
      };
    });
    const dataToSend = {
      segment_name: segmentName,
      schema: selectedData,
    }; // Replace with your data
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://webhook.site/ef8c00c7-3f0b-4b9d-86e5-1423da7b010e",
      headers: {
        "Content-Type": "text/plain",
      },
      data: dataToSend,
    };

    axios
      .request(config)
      .then((response) => {
        setSegmentName('');
        setSelectedArray([]);
        setRemainingArray(Lov_Data);
        setOpenDrawer(false);
        message.success('Segment Added Successfully');
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Cancel the segment 
  const cancelSegment = () => {
    setSegmentName('');
    setSelectedArray([]);
    setRemainingArray(Lov_Data);
    setOpenDrawer(false);
  };

  return (
    <Layout className="LayoutContainer">
      <Layout>
        <Header className="headerStyle">Header</Header>
        <Content className="contentStyle">
          <Button
            onClick={() => setOpenDrawer(!openDrawer)}
            className="buttonStyle"
          >
            Save segment
          </Button>
        </Content>
      </Layout>
      <Drawer
        title="Saving Segment"
        placement="right"
        className="CustomerDrawer"
        onClose={() => setOpenDrawer(false)}
        closeIcon={<LeftOutlined style={{ color: "#ffffff" }} />}
        open={openDrawer}
      >
        <div className="DrawerContent">
          <div className="SegmentLabel">Enter the Name of Segment</div>
          <Input
            placeholder="Name of the Segment"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            className="NameInput"
          />
          <div className="SegmentLine">
            To save your segment, you need to add the schemas to build the
            query.
          </div>
          {selectedArray.length > 0 && (
            <div className="AddedDropdown">
              {selectedArray.map((item, index) => {
                return (
                  <Select
                    key={item?.id}
                    onChange={(val) =>
                      setUpdateOption({ id: `${index}`, value: `${val}` })
                    }
                    className="NewDropdown"
                    defaultValue={`${
                      item === "first_name"
                        ? "First Name"
                        : item === "last_name"
                        ? "Last Name"
                        : item === "gender"
                        ? "Gender"
                        : item === "age"
                        ? "Age"
                        : item === "city"
                        ? "City"
                        : item === "state"
                        ? "State"
                        : item === "account_name"
                        ? "Account Name"
                        : selectedOption
                    }`}
                  >
                    {remainingArray.length > 0 &&
                      remainingArray.map((item) => {
                        return (
                          <option key={item.id} value={item}>
                            {item === "first_name"
                              ? "First Name"
                              : item === "last_name"
                              ? "Last Name"
                              : item === "gender"
                              ? "Gender"
                              : item === "age"
                              ? "Age"
                              : item === "city"
                              ? "City"
                              : item === "state"
                              ? "State"
                              : item === "account_name"
                              ? "Account Name"
                              : selectedOption}
                          </option>
                        );
                      })}
                  </Select>
                );
              })}
            </div>
          )}
          <div className="MainDropdownContainer">
            <Select
              onChange={(val) => setSelectedOption(val)}
              className="MainDropdown"
              value={selectedOption}
              placeholder="Select an option"
            >
              {Lov_Data.map((item) => {
                return (
                  <option value={item}>
                    {item === "first_name"
                      ? "First Name"
                      : item === "last_name"
                      ? "Last Name"
                      : item === "gender"
                      ? "Gender"
                      : item === "age"
                      ? "Age"
                      : item === "city"
                      ? "City"
                      : item === "state"
                      ? "State"
                      : item === "account_name" && "Account Name"}
                  </option>
                );
              })}
            </Select>
            <Button onClick={addDropdown} className="schemaBtn">
              + Add new schema
            </Button>
          </div>
        </div>
        <div className="Footer">
          <Button onClick={saveSegment} className="SaveBtn">
            Save the segment
          </Button>
          <Button onClick={cancelSegment} className="CancelBtn">Cancel</Button>
        </div>
      </Drawer>
    </Layout>
  );
}

export default Dashboard;
