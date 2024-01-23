import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  HStack,
  Center,
} from "@chakra-ui/react";

const MultiSigForm = () => {
  const [minValue, setMinValue] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [initialAuthoriser, setInitialAuthoriser] = useState("CEO");
  const [approver, setApprover] = useState("CFO");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [currentMinValue, setCurrentMinValue] = useState("0.05 BTC");
  const [topRadioValue, setTopRadioValue] = useState("");
  const [step, setStep] = useState(0);

  const getTransactionStatusColor = () => {
    switch (transactionStatus) {
      case "Transaction failed, invalid Authorisation":
        return "red";
      case "Transaction succeeded, funds sent!":
        return "green";
      case "Transaction submitted! Waiting for 2nd approval.":
        return "brand.200";
      default:
        return "black"; // Default color
    }
  };

  useEffect(() => {
    adjustApproverSelection();
  }, [topRadioValue]);

  const adjustApproverSelection = () => {
    const approvers = ["CEO", "CFO", "Accountant", "Manager"];
    let newIndex = approvers.indexOf(approver);

    if (approver === topRadioValue) {
      newIndex = (newIndex + 1) % approvers.length;
      setApprover(approvers[newIndex]);
    }
  };
  const handleSubmitTx = () => {
    setStep(1); // Set to step 1 when transaction is submitted
    setTransactionStatus("Transaction submitted! Waiting for 2nd approval.");
  };

  const handleSubmitApproval = () => {
    if (parseFloat(transactionValue) > parseFloat(minValue)) {
      if (
        (initialAuthoriser === "CEO" || approver === "CEO") &&
        (initialAuthoriser === "CFO" || approver === "CFO")
      ) {
        setTransactionStatus("Transaction succeeded, funds sent!");
      } else {
        setTransactionStatus("Transaction failed, invalid Authorisation");
      }
    } else {
      setTransactionStatus("Transaction succeeded, funds sent!");
    }
    setStep(0); // Reset to step 0
    setTopRadioValue("");
  };

  const handleSetThreshold = () => {
    setCurrentMinValue(`${minValue} BTC`);
  };

  const handleResetDemo = () => {
    setMinValue("");
    setTransactionValue("");
    setInitialAuthoriser("CEO");
    setApprover("CFO");
    setTransactionStatus("");
    setCurrentMinValue("0.05 BTC");
    setStep(0);
    setTopRadioValue("");
  };

  const handleTopRadioChange = (value: string) => {
    setTopRadioValue(value);
  };

  return (
    <Box color="white" padding="1rem rem 1rem 5rem">
      <VStack
        spacing={4}
        align="stretch"
        justifyContent="center"
        alignItems="center"
      >
        <FormControl id="min-value">
          <Center>
            <FormLabel fontSize={["xl", "3xl"]}>
              Set the transaction value that requires CEO/CFO Approval
            </FormLabel>
          </Center>
          <HStack>
            <Input
              placeholder="Min. Value in BTC"
              width="70%"
              type="text"
              value={minValue}
              onChange={(e) => {
                const inputValue = e.target.value;
                const regex = /^[0-9]*\.?[0-9]*$/;
                if (regex.test(inputValue)) {
                  setMinValue(inputValue);
                }
              }}
              disabled={step === 1}
            />
            <Button onClick={handleSetThreshold} disabled={step === 1}>
              Set Threshold
            </Button>
          </HStack>
          <Text
            margin="1rem 1rem 3rem 1rem"
            fontSize={["md", "lg"]}
            color="brand.200"
          >
            Current Threshold: {currentMinValue}
          </Text>
        </FormControl>

        <Center>
          <FormControl as="fieldset">
            <Center>
              <FormLabel fontSize={["xl", "3xl"]}>
                Select the Initial Authoriser for the Transaction
              </FormLabel>
            </Center>
            <Center>
              <RadioGroup
                onChange={(value) => {
                  handleTopRadioChange(value);
                  setInitialAuthoriser(value);
                }}
                value={initialAuthoriser}
                isDisabled={step === 1}
              >
                <Stack direction="row">
                  <Radio value="CEO">CEO</Radio>
                  <Radio value="CFO">CFO</Radio>
                  <Radio value="Accountant">Accountant</Radio>
                  <Radio value="Manager">Manager</Radio>
                </Stack>
              </RadioGroup>
            </Center>
          </FormControl>
        </Center>

        <FormControl margin="1rem 1rem 3rem 1rem" id="transaction-value">
          <Center>
            <FormLabel fontSize={["2xl", "xl"]}>
              Set Transaction Value in BTC
            </FormLabel>
          </Center>
          <HStack>
            <Input
              width="70%"
              placeholder="Transaction Value in BTC"
              type="text"
              value={transactionValue}
              onChange={(e) => {
                const inputValue = e.target.value;
                const regex = /^[0-9]*\.?[0-9]*$/;
                if (regex.test(inputValue)) {
                  setTransactionValue(inputValue);
                }
              }}
              disabled={step === 1}
            />
            <Button onClick={handleSubmitTx} disabled={step === 1}>
              Submit TX
            </Button>
          </HStack>
          <Text
            margin="1rem 1rem 3rem 1rem"
            fontSize={["md", "lg"]}
            color="brand.200"
          >
            {step === 1
              ? `${initialAuthoriser} sent a tx of ${transactionValue} BTC`
              : ``}
          </Text>
        </FormControl>

        <Center>
          <FormControl as="fieldset">
            <Center>
              <FormLabel fontSize={["xl", "3xl"]}>
                Select the Approver for the TX
              </FormLabel>
            </Center>
            <Center>
              <RadioGroup
                onChange={setApprover}
                value={approver}
                isDisabled={step === 0}
              >
                <Stack direction="row">
                  <Radio value="CEO" isDisabled={topRadioValue === "CEO"}>
                    CEO
                  </Radio>
                  <Radio value="CFO" isDisabled={topRadioValue === "CFO"}>
                    CFO
                  </Radio>
                  <Radio
                    value="Accountant"
                    isDisabled={topRadioValue === "Accountant"}
                  >
                    Accountant
                  </Radio>
                  <Radio
                    value="Manager"
                    isDisabled={topRadioValue === "Manager"}
                  >
                    Manager
                  </Radio>
                </Stack>
              </RadioGroup>
            </Center>
            <Center>
              <Button
                margin="3rem 1rem 3rem 1rem"
                onClick={handleSubmitApproval}
                disabled={step === 0}
              >
                Submit Approval
              </Button>
            </Center>
          </FormControl>
        </Center>

        <Box>
          <Text fontSize={["xl", "3xl"]} fontWeight="bold">
            TX Status
          </Text>
          <Text fontSize={["md", "2xl"]} color={getTransactionStatusColor()}>
            TX State: {transactionStatus}
          </Text>
          <Center>
            <Button
              margin="3rem 1rem 3rem 1rem"
              onClick={handleResetDemo}
              disabled={step === 1}
            >
              Reset Demo
            </Button>
          </Center>
        </Box>
      </VStack>
    </Box>
  );
};

export default MultiSigForm;
