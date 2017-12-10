import React, { Component } from "react";
import { Collapse, Button, Callout } from "@blueprintjs/core";
import TransactionTable from "./TransactionTable";
import NewTransaction from "./NewTransaction";

export default class NewBlockTransactionList extends Component {
  state = {
    isAddingNewTransaction: false,
    inputPublicKey: "",
    outputPublicKey: "",
    transactionAmount: 0
  };
  onChangeInputPublicKey = inputPublicKey => {
    this.setState({ inputPublicKey });
  };
  onChangeOutputPublicKey = outputPublicKey => {
    this.setState({ outputPublicKey });
  };
  onChangeTransactionAmount = evt => {
    this.setState({ transactionAmount: parseFloat(evt.target.value) || 0 });
  };
  addTransaction = () => {
    if (this.state.isAddingNewTransaction) {
      this.props.block.addTransaction(
        this.state.inputPublicKey,
        this.state.outputPublicKey,
        this.state.transactionAmount
      );
      this.setState({
        isAddingNewTransaction: false,
        inputPublicKey: "",
        outputPublicKey: "",
        transactionAmount: 0
      });
      this.props.rerender();
    } else {
      this.setState({ isAddingNewTransaction: true });
    }
  };

  shouldValidateTransaction() {
    return this.state.inputPublicKey !== "" && this.state.transactionAmount > 0;
  }

  isValidTransaction() {
    return this.props.block.isValidTransaction(
      this.state.inputPublicKey,
      this.state.transactionAmount
    );
  }

  addingTransactionErrorMessage() {
    return this.props.block.addingTransactionErrorMessage(
      this.state.inputPublicKey,
      this.state.transactionAmount
    );
  }

  render() {
    return (
      <div>
        <div>
          <p>
            This is where you can add transactions to this block. The UTXO pool
            will contain the mining reward of the coinbase that you can spend
            immediately
          </p>
          <TransactionTable block={this.props.block} />
          <Collapse isOpen={this.state.isAddingNewTransaction}>
            <NewTransaction
              inputPublicKey={this.state.inputPublicKey}
              outputPublicKey={this.state.outputPublicKey}
              transactionAmount={this.state.transactionAmount}
              onChangeInputPublicKey={this.onChangeInputPublicKey}
              onChangeOutputPublicKey={this.onChangeOutputPublicKey}
              onChangeTransactionAmount={this.onChangeTransactionAmount}
              block={this.props.block}
            />
            {this.shouldValidateTransaction() &&
              !this.isValidTransaction() && (
                <Callout className="pt-intent-danger">
                  <p>{this.addingTransactionErrorMessage()}</p>
                </Callout>
              )}
          </Collapse>

          <Button
            iconName="pt-icon-add"
            className="pt-intent-primary pt-input-action"
            onClick={this.addTransaction}
            disabled={
              this.state.isAddingNewTransaction && !this.isValidTransaction()
            }
            text={
              this.state.isAddingNewTransaction
                ? "Add Transaction to Block"
                : "Create Transaction"
            }
          />
        </div>
      </div>
    );
  }
}