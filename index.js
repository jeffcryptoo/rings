STATE = {};
function $(_) {return document.getElementById(_);}
let provider= {};
let signer= {};

window.addEventListener(
	'load',
	async function() {
		console.log("Initializing app...");
		// Initialize the app without waiting for wallet
		await dexstats();
		arf();
	},
	false
);

document.addEventListener('DOMContentLoaded', function() {
    paintStatic();
    initializeModernUI();
});

// Modern UI initialization
function initializeModernUI() {
    // Setup input change handlers for real-time updates
    const zapAmtInput = $('zap-amt');
    if (zapAmtInput) {
        zapAmtInput.addEventListener('input', updateZapOutput);
    }
    
    // Hide legacy tab system
    const tabElements = document.querySelectorAll('.tabcontent');
    tabElements.forEach(el => el.style.display = 'none');
    
    // Add click handlers for better UX
    setupClickHandlers();
}

function updateZapOutput() {
    const zapAmt = parseFloat($('zap-amt').value) || 0;
    const exchangeRate = Number(STATE.global?.base_per_wrap || 1e18) / 1e18;
    const output = zapAmt / exchangeRate;
    
    if ($('zap-output')) {
        $('zap-output').textContent = output.toFixed(6);
    }
}

function setupClickHandlers() {
    // Add hover effects and click feedback
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('input')) {
                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

// Legacy tab function for backwards compatibility
function openTab(evt, tabName) {
    // This is kept for backwards compatibility but hidden in modern UI
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    if (document.getElementById("tablinks_"+tabName)) {
        document.getElementById("tablinks_"+tabName).className+=" active";
    }
    if (document.getElementById(tabName)) {
        document.getElementById(tabName).style.display = "block";
    }
}

function fornum(n,d) {
	_n=(Number(n)/10**Number(d));
	n_=_n;
	if(_n>1e18){n_=(_n/1e18).toFixed(2)+"Qt"}
	else if(_n>1e15){n_=(_n/1e15).toFixed(2)+"Qd"}
	else if(_n>1e12){n_=(_n/1e12).toFixed(2)+"T"}
	else if(_n>1e9){n_=(_n/1e9).toFixed(2)+"B"}
	else if(_n>1e6){n_=(_n/1e6).toFixed(2)+"M"}
	else if(_n>1e3){n_=(_n/1e3).toFixed(2)+"K"}
	else if(_n>1e0){n_=(_n/1e0).toFixed(5)+""}
	else if(_n>0.0){n_=(_n/1e0).toFixed(8)+""}
	return(n_);
}
function fornum5(n,d) {
	return (Number(n)/10**Number(d)).toLocaleString(undefined,{maximumFractionDigits:d}) ;
}
function fornum6(n,f) {
	return (Number(n)).toLocaleString(undefined,{maximumFractionDigits:f}) ;
}

async function cw() {
	let cs = await cw2(); cs?console.log("Good to Transact"):cw2();
	cw2();
}

async function cw2() {
	// Check for any Ethereum provider (MetaMask, Rabby, etc.)
	if (!window.ethereum) {
		notice(`No wallet detected!<br>Please install MetaMask, Rabby, or another Web3 wallet and refresh the page.`);
		return(0);
	}

	try {
		// Request account access - this will trigger the wallet popup
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		
		if (accounts.length > 0) {
			console.log("Wallet connected successfully:", accounts[0]);
			
			// Set up provider and signer
			provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner();
			
			// Check if we're on the correct network
			const chainId = await window.ethereum.request({ method: 'eth_chainId' });
			if (Number(chainId) !== CHAINID) {
				notice(`Wrong network detected!<br>Please switch to chain ID ${CHAINID} (${CHAIN_NAME}).`);
				return(0);
			}
			
			// Update wallet display
			const walletAddress = accounts[0];
			if ($("cw")) {
				$("cw").innerHTML = `<button class="btn btn-primary">${walletAddress.substr(0,6)}...${walletAddress.substr(-4)}</button>`;
			}
			
			// Update user data
			gubs();
			return(1);
			
		} else {
			console.log("No accounts found");
			notice("No accounts found. Please connect your wallet.");
			return(0);
		}
		
	} catch (error) {
		console.error("Wallet connection error:", error);
		if (error.code === 4001) {
			notice("Wallet connection cancelled by user.");
		} else {
			notice(`Wallet connection failed!<br>Error: ${error.message}`);
		}
		return(0);
	}
}

function fornum2(n,d)
{
	_n=(Number(n)/10**Number(d));
	n_=_n;
	if(_n>1e18){n_=(_n/1e18).toFixed(2)+" Quintillion"}
	else if(_n>1e15){n_=(_n/1e15).toFixed(2)+" Quadrillion"}
	else if(_n>1e12){n_=(_n/1e12).toFixed(2)+" Trillion"}
	else if(_n>1e9){n_=(_n/1e9).toFixed(2)+" Billion"}
	else if(_n>1e6){n_=(_n/1e6).toFixed(2)+" Million"}
	else if(_n>1e3){n_=(_n/1e3).toFixed(2)+" Thousand"}
	else if(_n>1e0){n_=(_n/1e0).toFixed(4)+""}
	else if(_n>0){n_=(_n).toFixed(8)+""}
	return(n_);
}

function notice(c) {
	// Create a modern notification instead of using the old modal
	const notification = document.createElement('div');
	notification.className = 'notification';
	notification.innerHTML = `
		<div class="notification-content">
			${c}
			<button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
		</div>
	`;
	document.body.appendChild(notification);
	
	// Auto-remove after 5 seconds
	setTimeout(() => {
		if (notification.parentElement) {
			notification.remove();
		}
	}, 5000);
	
	console.log(c);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const timeFormat = (timestamp) => {const seconds = Math.floor((Date.now() - timestamp) / 1000);const prefix = seconds < 0 ? "For the next " : "Expired ";const absSeconds = Math.abs(seconds);return prefix + (absSeconds < 60 ? absSeconds + " seconds" : absSeconds < 3600 ? Math.floor(absSeconds / 60) + " minutes" : absSeconds < 86400 ? Math.floor(absSeconds / 3600) + " hours" : absSeconds < 2592000 ? Math.floor(absSeconds / 86400) + " days" : absSeconds < 31536000 ? Math.floor(absSeconds / 2592000) + " months" : Math.floor(absSeconds / 31536000) + " years") + (seconds < 0 ? "" : " ago");};

LPABI = ["function balanceOf(address) public view returns(uint)","function metadata() public view returns(uint,uint,uint,uint,bool,address,address)","function getAssetPrice(address) public view returns(uint)","function approve(address,uint)","function allowance(address,address) public view returns(uint)","function earned(address,address) public view returns(uint)","function earnings(address,address) public view returns(uint)","function name() public view returns(string)","function symbol() public view returns(string)","function tvl() public view returns(uint)","function tvlDeposits() public view returns(uint)","function apr() public view returns(uint)","function totalSupply() public view returns(uint)","function deposit(uint)","function withdraw(uint)","function depositAll()","function withdrawAll()","function mint(uint)","function redeem(uint)","function mintAll()","function redeemAll()"]

DEPOSITOR_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"nft","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"veAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"md","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mb","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wen","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"nft","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"veAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rd","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rb","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"wen","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ELTOKEN","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VENFT","outputs":[{"internalType":"contract IVotingEscrow","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VOTER","outputs":[{"internalType":"contract IVoter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mi","type":"uint256"}],"name":"copyVotesFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dao","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"floor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"address","name":"_farm","type":"address"}],"name":"getAllowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"getApr","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"getTvl","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"address[]","name":"_farms","type":"address[]"},{"internalType":"address[]","name":"_pricing","type":"address[]"}],"name":"info","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_vo","type":"address"},{"internalType":"address","name":"_el","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintingFeesToBurn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintingFeesToDao","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_inc","type":"uint256"}],"name":"rawQuote","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"redemptionFeesToBurn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"redemptionFeesToDao","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_t","type":"address"},{"internalType":"uint256","name":"_a","type":"uint256"}],"name":"rescue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"d","type":"address"}],"name":"setDAO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_md","type":"uint256"},{"internalType":"uint256","name":"_mb","type":"uint256"},{"internalType":"uint256","name":"_rd","type":"uint256"},{"internalType":"uint256","name":"_rb","type":"uint256"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_f","type":"uint256"}],"name":"setFloor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"setID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_p","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_m","type":"address"},{"internalType":"bool","name":"_b","type":"bool"}],"name":"setVoteManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_p","type":"address[]"},{"internalType":"uint256[]","name":"_w","type":"uint256[]"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voteManager","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"voteReset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tamt","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]

CTOKEN_ABI = [{"inputs":[{"internalType":"address","name":"underlying_","type":"address"},{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address payable","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AcceptAdminPendingAdminCheck","type":"error"},{"inputs":[{"internalType":"uint256","name":"actualAddAmount","type":"uint256"}],"name":"AddReservesFactorFreshCheck","type":"error"},{"inputs":[],"name":"BorrowCashNotAvailable","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"BorrowComptrollerRejection","type":"error"},{"inputs":[],"name":"BorrowFreshnessCheck","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"LiquidateAccrueBorrowInterestFailed","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"LiquidateAccrueCollateralInterestFailed","type":"error"},{"inputs":[],"name":"LiquidateCloseAmountIsUintMax","type":"error"},{"inputs":[],"name":"LiquidateCloseAmountIsZero","type":"error"},{"inputs":[],"name":"LiquidateCollateralFreshnessCheck","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"LiquidateComptrollerRejection","type":"error"},{"inputs":[],"name":"LiquidateFreshnessCheck","type":"error"},{"inputs":[],"name":"LiquidateLiquidatorIsBorrower","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"LiquidateRepayBorrowFreshFailed","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"LiquidateSeizeComptrollerRejection","type":"error"},{"inputs":[],"name":"LiquidateSeizeLiquidatorIsBorrower","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"MintComptrollerRejection","type":"error"},{"inputs":[],"name":"MintFreshnessCheck","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"RedeemComptrollerRejection","type":"error"},{"inputs":[],"name":"RedeemFreshnessCheck","type":"error"},{"inputs":[],"name":"RedeemTransferOutNotPossible","type":"error"},{"inputs":[],"name":"ReduceReservesAdminCheck","type":"error"},{"inputs":[],"name":"ReduceReservesCashNotAvailable","type":"error"},{"inputs":[],"name":"ReduceReservesCashValidation","type":"error"},{"inputs":[],"name":"ReduceReservesFreshCheck","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"RepayBorrowComptrollerRejection","type":"error"},{"inputs":[],"name":"RepayBorrowFreshnessCheck","type":"error"},{"inputs":[],"name":"SetComptrollerOwnerCheck","type":"error"},{"inputs":[],"name":"SetInterestRateModelFreshCheck","type":"error"},{"inputs":[],"name":"SetInterestRateModelOwnerCheck","type":"error"},{"inputs":[],"name":"SetPendingAdminOwnerCheck","type":"error"},{"inputs":[],"name":"SetReserveFactorAdminCheck","type":"error"},{"inputs":[],"name":"SetReserveFactorBoundsCheck","type":"error"},{"inputs":[],"name":"SetReserveFactorFreshCheck","type":"error"},{"inputs":[{"internalType":"uint256","name":"errorCode","type":"uint256"}],"name":"TransferComptrollerRejection","type":"error"},{"inputs":[],"name":"TransferNotAllowed","type":"error"},{"inputs":[],"name":"TransferNotEnough","type":"error"},{"inputs":[],"name":"TransferTooMuch","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cashPrior","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"interestAccumulated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"borrowIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"AccrueInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"borrowAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"cTokenCollateral","type":"address"},{"indexed":false,"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"mintTokens","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ComptrollerInterface","name":"oldComptroller","type":"address"},{"indexed":false,"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"NewComptroller","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract InterestRateModel","name":"oldInterestRateModel","type":"address"},{"indexed":false,"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"NewMarketInterestRateModel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldPendingAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldReserveFactorMantissa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"NewReserveFactor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"redeemer","type":"address"},{"indexed":false,"internalType":"uint256","name":"redeemAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"repayAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrows","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalBorrows","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"benefactor","type":"address"},{"indexed":false,"internalType":"uint256","name":"addAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"},{"indexed":false,"internalType":"uint256","name":"reduceAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalReserves","type":"uint256"}],"name":"ReservesReduced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"NO_ERROR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_acceptAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"addAmount","type":"uint256"}],"name":"_addReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"compLikeDelegatee","type":"address"}],"name":"_delegateCompLikeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"reduceAmount","type":"uint256"}],"name":"_reduceReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ComptrollerInterface","name":"newComptroller","type":"address"}],"name":"_setComptroller","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract InterestRateModel","name":"newInterestRateModel","type":"address"}],"name":"_setInterestRateModel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newPendingAdmin","type":"address"}],"name":"_setPendingAdmin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newReserveFactorMantissa","type":"uint256"}],"name":"_setReserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accrualBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accrueInterest","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOfUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"borrowAmount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"borrowIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"borrowRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"comptroller","outputs":[{"internalType":"contract ComptrollerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"exchangeRateCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"exchangeRateStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getAccountSnapshot","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"underlying_","type":"address"},{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ComptrollerInterface","name":"comptroller_","type":"address"},{"internalType":"contract InterestRateModel","name":"interestRateModel_","type":"address"},{"internalType":"uint256","name":"initialExchangeRateMantissa_","type":"uint256"},{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"interestRateModel","outputs":[{"internalType":"contract InterestRateModel","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isCToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"repayAmount","type":"uint256"},{"internalType":"contract CTokenInterface","name":"cTokenCollateral","type":"address"}],"name":"liquidateBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"mintAmount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolSeizeShareMantissa","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"redeemTokens","type":"uint256"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"redeemAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"repayAmount","type":"uint256"}],"name":"repayBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"repayAmount","type":"uint256"}],"name":"repayBorrowBehalf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserveFactorMantissa","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"seizeTokens","type":"uint256"}],"name":"seize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"supplyRatePerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract EIP20NonStandardInterface","name":"token","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBorrows","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBorrowsCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalReserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"underlying","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

EL_27_ABI = [{"inputs": [],"name": "LA","outputs": [{"internalType": "contract ILA","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract IP","name": "p","type": "address"}],"name": "bucketList","outputs": [{"internalType": "uint24[]","name": "","type": "uint24[]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint24[]","name": "inp","type": "uint24[]"}],"name": "cast_24_256","outputs": [{"internalType": "uint256[]","name": "","type": "uint256[]"}],"stateMutability": "pure","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "farmType","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract IFarmland","name": "farm","type": "address"},{"internalType": "address","name": "user","type": "address"},{"internalType": "address","name": "guard","type": "address"}],"name": "getClset","outputs": [{"internalType": "uint256[13]","name": "ret","type": "uint256[13]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address[3][]","name": "_id","type": "address[3][]"}],"name": "getClsets","outputs": [{"internalType": "uint256[13][]","name": "","type": "uint256[13][]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract IFarmland","name": "farm","type": "address"},{"internalType": "contract IELM","name": "elm","type": "address"},{"internalType": "address","name": "user","type": "address"}],"name": "getElmaCompoundFarm","outputs": [{"internalType": "uint256[18]","name": "ret","type": "uint256[18]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract IFarmland[]","name": "_farms","type": "address[]"},{"internalType": "contract IELM[]","name": "_elm","type": "address[]"},{"internalType": "address","name": "_user","type": "address"}],"name": "getElmaCompoundFarms","outputs": [{"internalType": "uint256[18][]","name": "","type": "uint256[18][]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract IFarmland","name": "farm","type": "address"},{"internalType": "address","name": "user","type": "address"}],"name": "getSimpleFarm","outputs": [{"internalType": "uint256[7]","name": "ret","type": "uint256[7]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract IFarmland[]","name": "_farms","type": "address[]"},{"internalType": "address","name": "_user","type": "address"}],"name": "getSimpleFarms","outputs": [{"internalType": "uint256[7][]","name": "","type": "uint256[7][]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_user","type": "address"},{"internalType": "address","name": "_pool","type": "address"}],"name": "getTotalPosition","outputs": [{"internalType": "uint256","name": "x","type": "uint256"},{"internalType": "uint256","name": "y","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "contract ILA","name": "_la","type": "address"}],"name": "initializer","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "user","type": "address"},{"internalType": "address","name": "_pair","type": "address"}],"name": "positionOf","outputs": [{"internalType": "uint256[]","name": "bIds","type": "uint256[]"},{"internalType": "uint256[]","name": "amountsX","type": "uint256[]"},{"internalType": "uint256[]","name": "amountsY","type": "uint256[]"},{"internalType": "uint256[]","name": "liquidities","type": "uint256[]"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_f","type": "address"},{"internalType": "uint256","name": "_t","type": "uint256"}],"name": "setFarmType","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_wrapper","type": "address"},{"internalType": "address","name": "_vault","type": "address"},{"internalType": "address","name": "_vaultPool","type": "address"}],"name": "setVaultPools","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "vaultPools","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "vaults","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"}]

async function paintStatic() {
    // Set active tab (first one by default)
    const firstTab = document.getElementsByClassName('tablinks')[0];
    if (firstTab) firstTab.click();

	// Populate all the label elements with proper names
	document.querySelectorAll('[id^="l-ve-"]').forEach(el => el.innerHTML = VENFT_NAME);
	document.querySelectorAll('[id^="l-base-"]').forEach(el => el.innerHTML = BASE_NAME);
	document.querySelectorAll('[id^="l-wrap-"]').forEach(el => el.innerHTML = WRAP_NAME);
	document.querySelectorAll('[id^="l-sct-"]').forEach(el => el.innerHTML = SCT_NAME);

	// Populate footer contracts
	if ($("footer-contracts")) {
		$("footer-contracts").innerHTML = `
			<a target="_blank" href="${EXPLORE}/token/${BASE}" class="social-link">${BASE_NAME}</a>
			<a target="_blank" href="${EXPLORE}/token/${VENFT}" class="social-link">${VENFT_NAME}</a>
			<a target="_blank" href="${EXPLORE}/token/${WRAP}" class="social-link">${WRAP_NAME}</a>
			<a target="_blank" href="${EXPLORE}/address/${STKSCT_TELLER}" class="social-link">Teller</a>
			<a target="_blank" href="${EXPLORE}/address/${ZAP_SCT}" class="social-link">Zapper</a>
		`;
	}
}

async function dexstats() {
	_MGR_P = new ethers.Contract( DEPOSITOR , DEPOSITOR_ABI , provider );

	_inf = await _MGR_P.info(SAFE_ADDR,[],[]);
	
	STATE.global = {
		wrap_ts: BigInt(_inf[0][1]),
		base_per_wrap: BigInt(_inf[0][2]),
		wrap_redeemable: BigInt(_inf[0][3]),
		fees_rd: BigInt(_inf[0][4]),
		fees_rb: BigInt(_inf[0][5]),
		venft_id: BigInt(_inf[0][6]),
		venft_amt: BigInt(_inf[0][7]),
		venft_ts: BigInt(_inf[0][8]),
		venft_end: BigInt(_inf[0][9]),
		venft_ve: BigInt(_inf[0][7]) * ( BigInt(_inf[0][9]) - BigInt(Math.floor(Date.now()/1e3)) ) / BigInt(VENFT_MAXTIME),
		fees_mdb: BigInt(_inf[0][10]),
	}

	// Update stats display
	if ($("topstat-ve-amt")) $("topstat-ve-amt").innerHTML = fornum(STATE.global.venft_amt, BASE_DEC);
	if ($("topstat-wrap-ts")) $("topstat-wrap-ts").innerHTML = fornum(STATE.global.wrap_ts, WRAP_DEC);
	if ($("topstat-base-per-wrap")) $("topstat-base-per-wrap").innerHTML = (Number(STATE.global.base_per_wrap)/1e18).toFixed(6);
	if ($("topstat-dom")) $("topstat-dom").innerHTML = (Number(STATE.global.venft_amt)/Number(STATE.global.venft_ts)*100).toFixed(2)+"%";
	if ($("mint-fee")) $("mint-fee").innerHTML = (Number(STATE.global.fees_mdb)/1e18*100).toFixed(2) + "%";
	if ($("redeem-fee")) $("redeem-fee").innerHTML = ((Number(STATE.global.fees_rd)+Number(STATE.global.fees_rb))/1e18*100).toFixed(2) + "%";

	return;
}

async function arf(){
	let c=0;
	var xfr = setInterval(
		async function(){
			console.log("refreshing farm stats", new Date(), c );
			try {
				if( ethers?.utils?.isAddress(window?.ethereum?.selectedAddress) ) { gubs();}
				dexstats()
			}
			catch(e) { console.log('hmm..'); }
			c++;
		},
		16_000
	);
}

async function gubs() {
	_MGR = new ethers.Contract( DEPOSITOR , DEPOSITOR_ABI , signer );
	_sctbal = (await (new ethers.Contract(SCT,LPABI,signer)).balanceOf(window.ethereum.selectedAddress));
	_inf = await _MGR.info(window.ethereum.selectedAddress,[],[]);
	
	STATE.user = {
		wrap_bal : BigInt(_inf[0][0]),
		wrap_allow_mgr: BigInt(_inf[0][11]),
		venft_bal : BigInt(_inf[0][12]),
		sct_bal : BigInt(_sctbal),
	}
	
	STATE.global = {
		wrap_ts: BigInt(_inf[0][1]),
		base_per_wrap: BigInt(_inf[0][2]),
		wrap_redeemable: BigInt(_inf[0][3]),
		fees_rd: BigInt(_inf[0][4]),
		fees_rb: BigInt(_inf[0][5]),
		venft_id: BigInt(_inf[0][6]),
		venft_amt: BigInt(_inf[0][7]),
		venft_ts: BigInt(_inf[0][8]),
		venft_end: BigInt(_inf[0][9]),
		venft_ve: BigInt(_inf[0][7]) * ( BigInt(_inf[0][9]) - BigInt(Math.floor(Date.now()/1e3)) ) / BigInt(VENFT_MAXTIME),
		fees_mdb: BigInt(_inf[0][10]),
	}

	STATE.user.nfts = (new Array( _inf[4].length/4))
		.fill([])
		.map( (e,i) => [
			BigInt(_inf[4][i*4+0]),	// id
			BigInt(_inf[4][i*4+1]), // amt
			BigInt(_inf[4][i*4+2]), // end
			BigInt(_inf[4][i*4+3]),	// isApproved(mgr,id)
			BigInt(_inf[4][i*4+1]) * ( BigInt(_inf[4][i*4+2]) - BigInt(Math.floor(Date.now()/1e3)) ) / BigInt(VENFT_MAXTIME) // ve
		] )
	;

	// Update all displays
	if ($("topstat-ve-amt")) $("topstat-ve-amt").innerHTML = fornum(STATE.global.venft_amt, BASE_DEC);
	if ($("topstat-wrap-ts")) $("topstat-wrap-ts").innerHTML = fornum(STATE.global.wrap_ts, WRAP_DEC);
	if ($("topstat-base-per-wrap")) $("topstat-base-per-wrap").innerHTML = (Number(STATE.global.base_per_wrap)/1e18).toFixed(6);
	if ($("topstat-dom")) $("topstat-dom").innerHTML = (Number(STATE.global.venft_amt)/Number(STATE.global.venft_ts)*100).toFixed(2)+"%";
	if ($("mint-fee")) $("mint-fee").innerHTML = (Number(STATE.global.fees_mdb)/1e18*100).toFixed(2) + "%";
	if ($("redeem-fee")) $("redeem-fee").innerHTML = ((Number(STATE.global.fees_rd)+Number(STATE.global.fees_rb))/1e18*100).toFixed(2) + "%";

	// Update balance displays
	if ($("zap-bal")) $("zap-bal").innerHTML = `Balance: ${ fornum5(STATE.user.sct_bal, SCT_DEC) } ${ SCT_NAME}`;
	if ($("mint-bal")) $("mint-bal").innerHTML = `Balance: ${ Number(STATE.user.venft_bal) } ${ VENFT_NAME} NFTs`;
	if ($("redeem-bal")) $("redeem-bal").innerHTML = `Balance: ${ fornum5(STATE.user.wrap_bal, WRAP_DEC) } ${ WRAP_NAME}`;

	// Update NFT table with modern design
	if ($("mint-table") && STATE.user.nfts) {
		$("mint-table").innerHTML = STATE.user.nfts.map( (e,i) => { 
			const expectedOutput = Number(e[1]) / (Number(STATE.global.base_per_wrap)/1e18);
			return `
				<div class="mint-table-row" onclick="mint(${e[0]},${i})">
					<div class="mint-table-row-id">#${ e[0] }</div>
					<div class="nft-details">
						<div class="nft-amount">
							<img style='height:20px;position:relative;top:4px' src="${VENFT_LOGO}">
							${ fornum5(e[1], BASE_DEC) } ${ BASE_NAME }
						</div>
						<div class="nft-output">
							<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}">
							→ ${ fornum5(expectedOutput, WRAP_DEC) } ${ WRAP_NAME }
						</div>
					</div>
					<div>
						<button class="btn btn-primary submit">Convert</button>
					</div>
				</div>
			`}).join("")
	}

	// Update the zap output display in real-time
	updateZapOutput();

	return;
}

// Main transaction functions (keeping all existing logic)
async function zap(ismax) {
	_SCT = new ethers.Contract(SCT, LPABI, signer);
	_SCT_ZAP = new ethers.Contract(ZAP_SCT, ["function zapSCT(uint,uint) returns(uint)"],signer);

	al = await Promise.all([
		_SCT.allowance(window.ethereum.selectedAddress, ZAP_SCT),
		_SCT.balanceOf(window.ethereum.selectedAddress)
	]);
	al = al.map( el => BigInt(el) );

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	} else {
		_oamt = $("zap-amt").value;
		if(!isFinite(_oamt) || _oamt<1/(10**SCT_DEC)){notice(`Invalid ${SCT_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**SCT_DEC)))
	}

	_wrapout = _oamt * (10n**18n) / STATE.global.base_per_wrap;

	if(Number(_oamt)>Number(al[1])) {
		notice(`<h3>Insufficient Balance!</h3><div>Desired Amount: ${Number(_oamt)/(10**SCT_DEC)}</div><div>Actual Balance: ${Number(al[1])/(10**SCT_DEC)}</div><br><div>Please reduce the amount and retry again.</div>`);
		return;
	}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			<p>Please grant ${SCT_NAME} allowance.</p>
			<div><strong>Confirm this transaction in your wallet!</strong></div>
		`);
		let _tr = await _SCT.approve(ZAP_SCT, ethers.constants.MaxUint256);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<p>Spending rights of ${Number(_oamt)/(10**SCT_DEC)} ${SCT_NAME} granted.</p>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
			<br><p>Please confirm the next step with your wallet provider now.</p>
		`);
	}

	notice(`
		<h3>Transaction Summary</h3>
		<div class="transaction-summary">
			<div class="summary-item">
				<img src="${SCT_LOGO}" alt="${SCT_NAME}" style="width:20px;height:20px;">
				<span>${SCT_NAME} to Convert: <strong>${fornum5(_oamt,SCT_DEC)}</strong></span>
			</div>
			<div class="summary-arrow">↓</div>
			<div class="summary-item">
				<img src="${WRAP_LOGO}" alt="${WRAP_NAME}" style="width:20px;height:20px;">
				<span>Expected to Receive: <strong>${ fornum5(_wrapout,WRAP_DEC) } ${WRAP_NAME}</strong></span>
			</div>
		</div>
		<br><div><strong>Please confirm this transaction in your wallet!</strong></div>
	`);
	
	let _tr = await (ismax ? _SCT_ZAP.zapSCT(al[1], _wrapout * 999n / 1000n) : _SCT_ZAP.zapSCT(_oamt, _wrapout * 999n / 1000n));
	console.log(_tr);
	
	notice(`
		<h3>Transaction Submitted!</h3>
		<p>Converting ${SCT_NAME} to ${WRAP_NAME}...</p>
		<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
	`);
	
	_tw = await _tr.wait();
	console.log(_tw)
	
	notice(`
		<h3>Conversion Completed!</h3>
		<div class="transaction-summary">
			<div class="summary-item">
				<img src="${SCT_LOGO}" alt="${SCT_NAME}" style="width:20px;height:20px;">
				<span>${SCT_NAME} Converted: <strong>${fornum5(_oamt,SCT_DEC)}</strong></span>
			</div>
			<div class="summary-item">
				<img src="${WRAP_LOGO}" alt="${WRAP_NAME}" style="width:20px;height:20px;">
				<span>${WRAP_NAME} Received: <strong>${ fornum5(_wrapout,WRAP_DEC) }</strong></span>
			</div>
		</div>
		<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-primary">View on Explorer</a></p>
	`);
	gubs();
}

async function mint(_id, _idi) {
	ve = new ethers.Contract(VENFT, ["function voted(uint) public view returns(bool)","function isApprovedOrOwner(address,uint) public view returns(bool)","function approve(address,uint)"], signer);

	alvo = await Promise.all([
		ve.isApprovedOrOwner(DEPOSITOR,_id),
		ve.voted(_id),
	]);
	console.log("alvo: ",alvo);
	
	if(alvo[0]==false) {
		notice(`
			<h3>Approval required</h3>
			<p>${WRAP_NAME} Depositor requires your approval to complete this conversion.</p>
			<div><strong>Please confirm this transaction in your wallet!</strong></div>
		`);
		let _tr = await ve.approve(DEPOSITOR,_id);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
			<br><p>Please continue to the next steps now.</p>
		`);
	}
	
	if(alvo[1]==true) {
		notice(`
			<h3>Vote-Reset required</h3>
			<p>${WRAP_NAME} requires your veNFT to be in a non-voted state to complete this conversion.</p>
			<p>Resetting your votes...</p>
			<div><strong>Please confirm this transaction in your wallet!</strong></div>
		`);
		voter = new ethers.Contract(VOTER, ["function reset(uint)"], signer);
		let _tr = await voter.reset(_id);
		console.log(_tr);
		notice(`
			<h3>Submitting Vote-Reset Transaction!</h3>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Vote-Reset Completed!</h3>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
			<br><p>Please confirm the conversion in your wallet now.</p>
		`);
	}

	qd = await Promise.all([
		STATE.global.venft_amt,
		STATE.user.nfts[_idi][1],
		STATE.global.wrap_ts,
		STATE.user.nfts[_idi][4],
	]);
	
	console.log("sell.quoted: ",qd);
	_base = Number(qd[0]);
	_inc = Number(qd[1]);
	_ts = Number(qd[2]);
	_amt = (_inc * _ts) / _base;
	_tlw = (Number( STATE.user.nfts[_idi][2] )/86400/7 - Date.now()/86400000/7).toFixed();
	_q = [ _amt, _inc, _tlw ];
	
	notice(`
		<h3>Conversion Summary</h3>
		<div class="transaction-summary">
			<div class="summary-item">
				<img src="${BASE_LOGO}" alt="${BASE_NAME}" style="width:20px;height:20px;">
				<span>NFT Token ID: <strong>#${_id}</strong></span>
			</div>
			<div class="summary-item">
				<img src="${BASE_LOGO}" alt="${BASE_NAME}" style="width:20px;height:20px;">
				<span>Amount Locked: <strong>${ fornum5(_q[1],BASE_DEC) } ${BASE_NAME}</strong></span>
			</div>
			<div class="summary-item">
				<span>Time to Unlock: <strong>${Number(_q[2])} Weeks</strong> from now</span>
			</div>
			<div class="summary-arrow">↓</div>
			<div class="summary-item">
				<img src="${WRAP_LOGO}" alt="${WRAP_NAME}" style="width:20px;height:20px;">
				<span>Expected to Get: <strong>${ fornum5(_q[0],WRAP_DEC) } ${WRAP_NAME}</strong></span>
			</div>
		</div>
		<br><div><strong>Please confirm this transaction in your wallet!</strong></div>
	`);
	
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, ["function deposit(uint)"], signer);
	let _tr = await _DEPOSITOR.deposit(_id);
	console.log(_tr);
	
	notice(`
		<h3>Conversion Submitted!</h3>
		<p>Converting veNFT #${_id} to ${WRAP_NAME}...</p>
		<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
	`);
	
	_tw = await _tr.wait();
	console.log(_tw)
	
	notice(`
		<h3>Conversion Completed!</h3>
		<div class="transaction-summary">
			<div class="summary-item">
				<span>Converted veNFT: <strong>#${_id}</strong></span>
			</div>
			<div class="summary-item">
				<img src="${WRAP_LOGO}" alt="${WRAP_NAME}" style="width:20px;height:20px;">
				<span>Received: <strong>${fornum5(_q[0],WRAP_DEC)} ${WRAP_NAME}</strong></span>
			</div>
		</div>
		<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-primary">View on Explorer</a></p>
	`)
	gubs()
	return;
}

async function redeem(ismax) {
	if( (Date.now() % 604800e3) > (604800e3 - 86400e3) ) {
		notice(`<h3>Redemption Temporarily Unavailable</h3><p>Redeeming ${WRAP_NAME} to ${VENFT_NAME} is not available on Wednesdays.</p><p>Please try tomorrow!</p>`);
		return;
	}

	_BASE = new ethers.Contract(BASE, LPABI, signer);
	_WRAP = new ethers.Contract(WRAP, LPABI, signer);
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, DEPOSITOR_ABI, signer);

	al = await Promise.all([
		_WRAP.allowance(window.ethereum.selectedAddress, DEPOSITOR),
		_WRAP.balanceOf(window.ethereum.selectedAddress)
	]);
	al = al.map( el => BigInt(el) );

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	} else {
		_oamt = $("redeem-amt").value;
		if(!isFinite(_oamt)){notice(`Invalid ${WRAP_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}

	if(Number(_oamt)>Number(al[1])) {
		notice(`<h3>Insufficient Balance!</h3><div>Desired Amount: ${Number(_oamt)/(10**DECIMAL)}</div><div>Actual Balance: ${al[1]/(10**DECIMAL)}</div><br><div>Please reduce the amount and retry again.</div>`);
		return;
	}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			<p>Please grant ${WRAP_NAME} allowance.</p>
			<div><strong>Confirm this transaction in your wallet!</strong></div>
		`);
		let _tr = await _WRAP.approve(DEPOSITOR,_oamt);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<p>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${WRAP_NAME} granted.</p>
			<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
			<br><p>Please confirm the next step with your wallet provider now.</p>
		`);
	}

	_rdexp = _oamt * STATE.global.base_per_wrap / 10n**18n ;

	notice(`
		<h3>Redemption Summary</h3>
		<div class="transaction-summary">
			<div class="summary-item">
				<img src="${WRAP_LOGO}" alt="${WRAP_NAME}" style="width:20px;height:20px;">
				<span>${WRAP_NAME} to Redeem: <strong>${fornum5(_oamt,DECIMAL)}</strong></span>
			</div>
			<div class="summary-arrow">↓</div>
			<div class="summary-item">
				<img src="${BASE_LOGO}" alt="${VENFT_NAME}" style="width:20px;height:20px;">
				<span>${VENFT_NAME} Expected: <strong>${fornum5(_rdexp,DECIMAL)}</strong></span>
			</div>
		</div>
		<br><div><strong>Please confirm this transaction in your wallet!</strong></div>
	`);
	
	let _tr = await _DEPOSITOR.withdraw(_oamt);
	console.log(_tr);
	
	notice(`
		<h3>Redemption Submitted!</h3>
		<p>Redeeming ${WRAP_NAME}...</p>
		<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-outline">View on Explorer</a></p>
	`);
	
	_tw = await _tr.wait();
	console.log(_tw)
	
	notice(`
		<h3>Redemption Completed!</h3>
		<div class="transaction-summary">
			<div class="summary-item">
				<img src="${WRAP_LOGO}" alt="${WRAP_NAME}" style="width:20px;height:20px;">
				<span>${WRAP_NAME} Redeemed: <strong>${fornum5(_oamt,DECIMAL)}</strong></span>
			</div>
			<div class="summary-item">
				<img src="${BASE_LOGO}" alt="${VENFT_NAME}" style="width:20px;height:20px;">
				<span>${VENFT_NAME} Received: <strong>${fornum5(_rdexp,DECIMAL)}</strong></span>
			</div>
		</div>
		<p><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}" class="btn btn-primary">View on Explorer</a></p>
	`);
	gubs();
}

// Legacy staking functions (kept for compatibility)
async function stake(ismax) {
	// Implementation would go here when staking is enabled
	notice(`<h3>Staking Coming Soon!</h3><p>Staking features will be available at 500K TVL!</p>`);
}

async function unstake(ismax) {
	// Implementation would go here when staking is enabled
	notice(`<h3>Staking Coming Soon!</h3><p>Staking features will be available at 500K TVL!</p>`);
}

async function claim() {
	// Implementation would go here when staking is enabled
	notice(`<h3>Staking Coming Soon!</h3><p>Staking features will be available at 500K TVL!</p>`);
}

// UI Helper Functions
function showZapMode() {
    document.getElementById('zap-mode').classList.remove('hidden');
    document.getElementById('mint-mode').classList.add('hidden');
    document.querySelectorAll('.toggle-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

function showMintMode() {
    document.getElementById('zap-mode').classList.add('hidden');
    document.getElementById('mint-mode').classList.remove('hidden');
    document.querySelectorAll('.toggle-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

function showAllOpportunities() {
    document.getElementById('opportunities-modal').classList.remove('hidden');
    populateFullOpportunities();
}

function hideAllOpportunities() {
    document.getElementById('opportunities-modal').classList.add('hidden');
}

function populateFullOpportunities() {
    const container = document.getElementById('partner-pools-full');
    container.innerHTML = PARTNER_POOLS.map(pool => `
        <div class="opportunity-card" onclick="window.open('${pool.link}','_blank')">
            <div class="opportunity-header">
                <img src="${pool.platforms[0].icon}" alt="${pool.platforms[0].name}" class="platform-icon">
                <div class="opportunity-title">
                    <div class="platform-name">${pool.platforms[0].name}</div>
                    <div class="platform-type">${pool.platforms[0].subtext}</div>
                </div>
            </div>
            <div class="opportunity-assets">
                ${pool.tokens.map(token => `
                    <div class="asset-tag">
                        <img src="${token.icon}" alt="${token.name}" class="asset-icon">
                        ${token.name}
                    </div>
                `).join('')}
            </div>
            <div class="opportunity-rewards">
                ${pool.rewards.map(reward => `
                    <div class="reward-tag">
                        <img src="${reward.icon}" alt="${reward.name}" class="reward-icon">
                        ${reward.name}
                    </div>
                `).join('')}
            </div>
            <div class="opportunity-description">${pool.desc[0].maintext}</div>
        </div>
    `).join('');
}

// Function to fetch Spectra APY from API
async function fetchSpectraAPY() {
    try {
        const response = await fetch('https://app.spectra.finance/api/v1/sonic/pools');
        const pools = await response.json();
        
        // Find the eliteRingsScUSD pool
        const eliteRingsPool = pools.find(pool => 
            pool.underlying && 
            pool.underlying.address === '0xd4aa386bfceeedd9de0875b3ba07f51808592e22'
        );
        
        if (eliteRingsPool && eliteRingsPool.pools && eliteRingsPool.pools[0]) {
            const apy = eliteRingsPool.pools[0].lpApy?.total;
            if (apy !== null && apy !== undefined) {
                const yieldElement = document.getElementById('yield-spectra');
                if (yieldElement) {
                    yieldElement.textContent = `${apy.toFixed(2)}% APY`;
                    // Store APR for sorting
                    window.spectraAPR = apy;
                }
            }
        }
    } catch (error) {
        console.log('Could not fetch Spectra APY:', error);
        // Keep the default ~12.5% APY if API call fails
    }
}

// Function to fetch Equalizer APR from API
async function fetchEqualizerAPR() {
    try {
        const response = await fetch('https://eqapi-sonic-prod-ltanm.ondigitalocean.app/sonic/v4/pairs');
        const data = await response.json();
        
        if (data.success && data.data) {
            // Find all active pools with eliteRingsScUSD and TVL > $1,000
            const eliteRingsPools = Object.values(data.data).filter(pool => {
                return pool.tags && 
                       pool.tags.includes('active') && 
                       parseFloat(pool.tvlUsd) >= 1000 &&
                       (pool.token0?.address === '0xd4aA386bfCEEeDd9De0875B3BA07f51808592e22' ||
                        pool.token1?.address === '0xd4aA386bfCEEeDd9De0875B3BA07f51808592e22');
            });
            
            if (eliteRingsPools.length > 0) {
                // Find the highest APR among all qualifying eliteRingsScUSD pools
                const highestAPR = Math.max(...eliteRingsPools.map(pool => parseFloat(pool.apr) || 0));
                
                const yieldElement = document.getElementById('yield-equalizer');
                if (yieldElement && highestAPR > 0) {
                    yieldElement.textContent = `Up to ${highestAPR.toFixed(2)}% APR`;
                    // Store APR for sorting
                    window.equalizerAPR = highestAPR;
                }
            }
        }
    } catch (error) {
        console.log('Could not fetch Equalizer APR:', error);
        // Keep the default if API call fails
    }
}

// Function to fetch Impermax APR from API
async function fetchImpermaxAPR() {
    try {
        // Try to fetch from Impermax API - common endpoints
        const endpoints = [
            'https://sonic.impermax.finance/api/v1/lending-pools',
            'https://sonic.impermax.finance/api/lending-pools',
            'https://sonic.impermax.finance/api/v1/pools',
            'https://sonic.impermax.finance/api/pools'
        ];
        
        let impermaxData = null;
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    impermaxData = await response.json();
                    break;
                }
            } catch (e) {
                console.log(`Failed to fetch from ${endpoint}:`, e);
            }
        }
        
        if (impermaxData) {
            // Look for the eliteRingsScUSD pool data
            const eliteRingsPool = impermaxData.find(pool => 
                pool.underlying?.address === '0xd4aA386bfCEEeDd9De0875B3BA07f51808592e22' ||
                pool.token?.address === '0xd4aA386bfCEEeDd9De0875B3BA07f51808592e22' ||
                pool.address === '0x98cfa5addcb937c205e35d2bef0885f969dcf958'
            );
            
            if (eliteRingsPool && eliteRingsPool.supplyAPR !== undefined) {
                const apr = parseFloat(eliteRingsPool.supplyAPR);
                const yieldElement = document.getElementById('yield-impermax');
                if (yieldElement && apr > 0) {
                    yieldElement.textContent = `${apr.toFixed(2)}% APY`;
                    window.impermaxAPR = apr;
                }
            }
        }
        
        // If no API data found, don't display any APR
        if (!impermaxData || !eliteRingsPool) {
            const yieldElement = document.getElementById('yield-impermax');
            if (yieldElement) {
                yieldElement.textContent = ``;
                window.impermaxAPR = 0;
            }
        }
        
    } catch (error) {
        console.log('Could not fetch Impermax APR:', error);
        // Don't display any APR if API fails
        const yieldElement = document.getElementById('yield-impermax');
        if (yieldElement) {
            yieldElement.textContent = ``;
            window.impermaxAPR = 0;
        }
    }
}

// Function to sort opportunities by yield
function sortOpportunitiesByYield() {
    const container = document.getElementById('partner-pools-container');
    if (!container) return;

    // Get all opportunity elements
    const opportunities = Array.from(container.children);
    
    // Sort opportunities by APR (highest first)
    opportunities.sort((a, b) => {
        const aYield = a.querySelector('.opportunity-yield').textContent;
        const bYield = b.querySelector('.opportunity-yield').textContent;
        
        // Extract APR numbers from yield text
        const aAPR = parseFloat(aYield.match(/[\d.]+/)?.[0] || 0);
        const bAPR = parseFloat(bYield.match(/[\d.]+/)?.[0] || 0);
        
        return bAPR - aAPR; // Sort descending (highest first)
    });
    
    // Re-append sorted elements
    opportunities.forEach(opportunity => {
        container.appendChild(opportunity);
    });
}

// At the end of the file, attach UI functions to window for HTML access
window.showZapMode = showZapMode;
window.showMintMode = showMintMode;
window.showAllOpportunities = showAllOpportunities;
window.hideAllOpportunities = hideAllOpportunities;
window.populateFullOpportunities = populateFullOpportunities;
window.zap = zap;
window.mint = mint;
window.redeem = redeem;
window.stake = stake;
window.unstake = unstake;
window.claim = claim;

// Ensure DOMContentLoaded handler populates opportunities and fetches APRs
// (If not already present, add this block)
document.addEventListener('DOMContentLoaded', function() {
    paintStatic();
    initializeModernUI();

    // Populate initial opportunities preview
    const container = document.getElementById('partner-pools-container');
    if (container) {
        container.innerHTML = PARTNER_POOLS.slice(0, 3).map(pool => `
            <div class="opportunity-preview" onclick="window.open('${pool.link}','_blank')">
                <div class="opportunity-platform">
                    <img src="${pool.platforms[0].icon}" alt="${pool.platforms[0].name}" class="platform-icon">
                    <span>${pool.platforms[0].name}</span>
                </div>
                <div class="opportunity-yield" id="yield-${pool.platforms[0].name.toLowerCase()}"></div>
            </div>
        `).join('');
    }

    // Fetch all APY/APR data and then sort by highest yield
    Promise.all([
        fetchSpectraAPY(),
        fetchEqualizerAPR(),
        fetchImpermaxAPR()
    ]).then(() => {
        sortOpportunitiesByYield();
    });
});
