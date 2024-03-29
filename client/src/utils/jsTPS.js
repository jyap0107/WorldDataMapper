export class jsTPS_Transaction {
    constructor() {};
    doTransaction() {};
    undoTransaction () {};
}
export class AddSubregion_Transaction extends jsTPS_Transaction {
    constructor(region, index, isMap, doFunction, undoFunction) {
        super();
        this.region = region;
        this.index = index;
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
        this.isMap = isMap
    }
    async doTransaction() {
        if (this.prevRegionId) {
            this.region._id = this.prevRegionId;
        }

        const { data } = await this.doFunction({variables: { region: this.region, index: this.index, isMap: this.isMap }})
        if (data) {
            console.log(data.addRegion);
            this.prevRegionId = data.addRegion;
        }
        this.region._id = this.prevRegionId;
    }
    async undoTransaction() {
        console.log("yes");
        const { data } = await this.undoFunction({variables: { region_id: this.prevRegionId, isMap: this.isMap }})
        console.log(this.prevRegionId);
    }
}
export class DeleteSubregion_Transaction extends jsTPS_Transaction {
    constructor(_id, index, doFunction, undoFunction) {
        super();
        this._id = _id;
        this.index = index;
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
    }
    async doTransaction() {
        console.log(this.index);
        const { data } = await this.doFunction({variables: {region_id: this._id, isMap: false}});
        this.deletedRegions = data.deleteRegion;
        this.deletedRegions = this.deletedRegions.map(({__typename, ...item}) => item);
    }
    async undoTransaction() {
        const { data } = await this.undoFunction({variables: {parentRegion: this._id, regions: this.deletedRegions, index: this.index}})
        console.log(this.deletedRegions[0]._id);
    }
}
export class EditSubregionField_Transaction extends jsTPS_Transaction {
    constructor(_id, field, prevVal, newVal, doFunction) {
        super();
        this._id = _id;
        this.field = field;
        this.prevVal = prevVal;
        this.newVal = newVal;
        this.doFunction = doFunction;
    }
    async doTransaction() {
        const { data } = await this.doFunction({variables: { region_id: this._id, field: this.field, value: this.newVal}});
        console.log("Prev, New, ID, for do/redo")
        console.log(this.prevVal);
        console.log(this.newVal);
        console.log(this._id);
    }
    async undoTransaction() {
        const { data } = await this.doFunction({variables: { region_id: this._id, field: this.field, value: this.prevVal}});
        console.log("Prev, New, ID, for undo")
        console.log(this.prevVal);
        console.log(this.newVal);
        console.log(this._id);
    }
}
export class SortCol_Transaction extends jsTPS_Transaction {
    constructor(_id, field, sortAsc, doFunction, undoFunction) {
        super();
        this._id = _id;
        this.field = field;
        this.sortAsc = sortAsc;
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
    }
    async doTransaction() {
        const { data } = await this.doFunction({variables: { region_id: this._id, field: this.field, sortAsc: this.sortAsc}});
        this.prevOrder = data.sortCol;
    }
    async undoTransaction() {
        const { data } = await this.undoFunction({variables: {region_id: this._id, order: this.prevOrder}})
    }
}
export class DeleteLandmark_Transaction extends jsTPS_Transaction {
    constructor(_id, landmark, index, doFunction, undoFunction) {
        super();
        this._id = _id;
        this.landmark = landmark;
        this.index = index;
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
    }
    async doTransaction() {
        const { data } = await this.doFunction({variables: { region_id: this._id, value: this.landmark}})
        console.log("doing")
    }
    async undoTransaction() {
        const { data } = await this.undoFunction({variables: {region_id: this._id, landmark: this.landmark, index: this.index}})
    }
}
export class AddLandmark_Transaction extends jsTPS_Transaction {
    constructor(_id, landmark, doFunction, undoFunction) {
        super();
        this._id = _id;
        this.landmark = landmark;
        this.doFunction = doFunction;
        this.undoFunction = undoFunction;
    }
    async doTransaction() {
        const { data } = await this.doFunction({variables: { region_id: this._id, landmark: this.landmark, index: this.index}})
        console.log("doing");
    }
    async undoTransaction() {
        const { data } = await this.undoFunction({variables: {region_id: this._id, value: this.landmark}})
    }
}
export class EditLandmark_Transaction extends jsTPS_Transaction {
    constructor(_id, prevValue, newValue, doFunction) {
        super();
        this._id = _id;
        this.prevValue = prevValue;
        this.newValue = newValue;
        this.doFunction = doFunction;
        this.undoFunction = doFunction;
    }
    async doTransaction() {
        const { data } = await this.doFunction({variables: { region_id: this._id, prevValue: this.prevValue, newValue: this.newValue}})
    }
    async undoTransaction() {
        const { data } = await this.undoFunction({variables: {region_id: this._id, prevValue: this.newValue, newValue: this.prevValue}})
    }
}
export class ChangeParentRegion_Transaction extends jsTPS_Transaction {
    constructor(_id, oldParent, newParent, doFunction) {
        super();
        this._id = _id;
        this.oldParent = oldParent;
        this.newParent = newParent;
        this.doFunction = doFunction;
        this.undoFunction = doFunction;
    }
    async doTransaction() {
        const {data} = await this.doFunction({variables: {region_id: this._id, newParent: this.newParent}});
    }
    async undoTransaction() {
        const {data} = await this.undoFunction({variables: {region_id: this._id, newParent: this.oldParent}});
    }
}

export class jsTPS {
    constructor() {
        // THE TRANSACTION STACK
        this.transactions = [];
        // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
        // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
        this.mostRecentTransaction = -1;
        // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
        // DO AND UNDO OPERATIONS ARE BEING PERFORMED
        this.performingDo = false;
        this.performingUndo = false;
    }
    
    /**
     * Tests to see if the do (i.e. redo) operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the do (i.e. redo) operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingDo() {
        return this.performingDo;
    }
    
    /**
     * Tests to see if the undo operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the undo operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingUndo() {
        return this.performingUndo;
    }
    
    /**
     * This function adds the transaction argument to the top of
     * the transaction processing system stack and then executes it. Note that it does
     * When this method has completed transaction will be at the top 
     * of the stack, it will have been completed, and the counter have
     * been moved accordingly.
     * 
     * param transaction The custom transaction to be added to
     * the transaction processing system stack and executed.
     */
    addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0)|| (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (let i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1);
            }
        }

        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);
        // AND EXECUTE IT
        // this.doTransaction();        
    }

    /**
     * This function executes the transaction at the location of the counter,
     * then moving the TPS counter. Note that this may be the transaction
     * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
     */
     async doTransaction() {
		let retVal;
        console.log(this);
        if (this.hasTransactionToRedo()) {   
            this.performingDo = true;
            let transaction = this.transactions[this.mostRecentTransaction+1];
			retVal = await transaction.doTransaction();
			this.mostRecentTransaction++;
            console.log(this.mostRecentTransaction);
			this.performingDo = false;
            
        }
        // console.log('transactions: ' + this.getSize());
        // console.log('redo transactions:' + this.getRedoSize());
        // console.log('undo transactions:' + this.getUndoSize());
		console.log(' ')
		return retVal;
    }
    
    /**
     * This function checks to see if there is a transaction to undo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if undo is performed, if
     * there is no transaction to undo, null is returned.
     */
    peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[this.mostRecentTransaction];
        }
        else
            return null;
    }
    
    /**
     * This function checks to see if there is a transaction to redo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if redo is performed, if
     * there is no transaction to undo, null is returned.
     */    
    peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[this.mostRecentTransaction+1];
        }
        else
            return null;
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
     async undoTransaction() {
		let retVal;
        console.log(this);
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            let transaction = this.transactions[this.mostRecentTransaction];
			retVal = await transaction.undoTransaction();
            this.mostRecentTransaction--;
			this.performingUndo = false;
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
        console.log(' ')
		return(retVal);
    }

    /**
     * This method clears all transactions from the TPS stack
     * and resets the counter that keeps track of the location
     * of the top of the stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions = [];
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }
    
    /**
     * Accessor method that returns the number of transactions currently
     * on the transaction stack. This includes those that may have been
     * done, undone, and redone.
     * 
     * return The number of transactions currently in the transaction stack.
     */
    getSize() {
        return this.transactions.length;
    }
    
    /**
     * This method returns the number of transactions currently in the
     * transaction stack that can be redone, meaning they have been added
     * and done, and then undone.
     * 
     * return The number of transactions in the stack that can be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    /**
     * This method returns the number of transactions currently in the 
     * transaction stack that can be undone.
     * 
     * return The number of transactions in the transaction stack that
     * can be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be undone at the time this function is called.
     * 
     * return true if an undo operation is possible, false otherwise.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be redone at the time this function is called.
     * 
     * return true if a redo operation is possible, false otherwise.
     */
    hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }
        
    /**
     * This method builds and returns a textual summary of the current
     * Transaction Processing System, this includes the toString of
     * each transaction in the stack.
     * 
     * return A textual summary of the TPS.
     */
    // toString() {
    //     let text = "<br>" +"--Number of Transactions: " + this.transactions.length + "</br>";
    //     text += "<br>" + "--Current Index on Stack: " + this.mostRecentTransaction + "</br>";
    //     text += "<br>" + "--Current Transaction Stack:" + "</br>";
    //     for (let i = 0; i <= this.mostRecentTransaction; i++) {
    //         let jsT = this.transactions[i];
    //         text += "<br>" + "----" + jsT.toString() + "</br>";
    //     }
    //     return text;
    // }
}
