STATE = {};
function $(_) {return document.getElementById(_);}
let provider= {};
let signer= {};

window.addEventListener(
	'load',
	async function() {
		console.log("waitin for 3 secs..");
		$("cw_m").innerHTML = "Connecting.. Please wait."
		setTimeout(async () => { await basetrip(); }, 3000);
	},
	false
);

document.addEventListener('DOMContentLoaded', function() {
    paintStatic();
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById("tablinks_"+tabName).className+=" active";
    document.getElementById(tabName).style.display = "block";
    //evt?.currentTarget?.className += " active";
    //window.location = "#"+tabName;
}



async function basetrip()
{
	if(!(window.ethereum)){$("cw_m").innerHTML = "Wallet wasn't detected!";console.log("Wallet wasn't detected!");notice("<h3>Wallet wasn't detected!</h3>Please make sure that your device and browser have an active Web3 wallet like MetaMask installed and running.<br><br>Visit <a href='https://metamask.io' target='_blank'>metamask.io</a> to install MetaMask wallet.");provider = new ethers.providers.JsonRpcProvider(RPC_URL); await dexstats();return}
	else if(!Number(window.ethereum.chainId)==CHAINID){$("cw_m").innerHTML = "Wrong network! Please Switch to "+CHAINID;provider = new ethers.providers.Web3Provider(window.ethereum);await dexstats();notice("<h3>Wrong network!</h3>Please Switch to Chain #"+CHAINID+"<btr"+ CHAIN_NAME+ "</u> Blockchain.");}
	else if(//typeOf window.ethereum == Object &&Number(window.ethereum.chainId)
		Number(window.ethereum.chainId)==CHAINID)
	{
		console.log("Recognized Ethereum Chain:", window.ethereum.chainId,CHAINID);
		provider = new ethers.providers.Web3Provider(window.ethereum)
		signer = provider.getSigner();
		if(!(window.ethereum.selectedAddress==null)){console.log("Found old wallet:", window.ethereum.selectedAddress);cw();}
		else{console.log("Didnt find a connected wallet!");cw();}
		//chkAppr(tokes[1][0])
	}
	else //if(Number(window.ethereum.chainId)==CHAINID)
	{
		console.log("Couldn't find Ethereum Provider - ",CHAINID,window.ethereum.chainId)
		if((typeof Number(window.ethereum.chainId) == "number")){$("cw_m").innerHTML = "Wrong network! Switch from " + Number(window.ethereum.chainId)+" to "+CHAINID}
		provider = new ethers.providers.JsonRpcProvider(RPC_URL);
		signer = provider.getSigner()
		$("connect").innerHTML=`Wallet not found.<br><br><div onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Retry?</div>`;
		notice(`Wallet not found.<br><br><div onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Retry?</div>`);
	}

	if(
		(Number(window.ethereum.chainId) != null )
		&& (window.ethereum.chainId != CHAINID)
	) {
		await window.ethereum.request({
    		method: "wallet_addEthereumChain",
    		params: [{
        		chainId: "0x"+(CHAINID).toString(16),
        		rpcUrls: [RPC_URL],
        		chainName: CHAIN_NAME,
        		nativeCurrency: {
            		name: CHAIN_GAS,
            		symbol: CHAIN_GAS,
            		decimals: 18
        		},
        		blockExplorerUrls: [EXPLORE]
    		}]
		});
		//window.location.reload()
		notice(`Switching Network...<br>Please Refresh the Page<br><div onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</div>`);
	}
	//DrefreshFarm()
	arf()
	cw()
	await dexstats()
}



/*
function fornum(n,d)
{
	_n=(Number(n)/10**Number(d));
	n_=_n;
	if(_n>1e18){n_=(_n/1e18).toFixed(2)+" Qt."}
	else if(_n>1e15){n_=(_n/1e15).toFixed(2)+" Qd."}
	else if(_n>1e12){n_=(_n/1e12).toFixed(2)+" Tn."}
	else if(_n>1e9){n_=(_n/1e9).toFixed(2)+" Bn."}
	else if(_n>1e6){n_=(_n/1e6).toFixed(2)+" Mn."}
	else if(_n>1e3){n_=(_n/1e3).toFixed(2)+" Th."}
	else if(_n>0){n_=(_n/1e0).toFixed(5)+""}
	return(n_);
}
*/
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
	if(!(window.ethereum)){notice(`Metamask not detected!<br>Please Refresh the Page<br><div onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</div>`);return(0)}
	if(!(Number(window.ethereum.chainId)==CHAINID)){notice(`Wrong network detected!<br>Please switch to chain ID ${CHAINID} and refresh this page.<br><div onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</div>`);return(0)}
	if(typeof provider == "undefined"){notice(`Provider not detected!<br>Please connect with a web3 provider or wallet and refresh this page.<br><div onclick="window.location.reload()" class="c2a-1 submit equal-gradient c2abtn">Refresh</div>`);return(0)}
	/*
	if(!
		(isFinite(Number(accounts[0])))
		|| (isFinite(Number(window.ethereum.selectedAddress)))
	){console.log("NAAAAAAAAAAAAAAAAA");window.location.reload();}
	*/

	//004
	window.ethereum
	.request({ method: 'eth_requestAccounts' })
	.then(r=>{console.log("004: Success:",r);})	//re-curse to end curse, maybe..
	.catch((error) => {	console.error("004 - Failure", r, error); });


	//005
	const accounts = await window.ethereum.request({ method: 'eth_accounts' });
	if(Number(accounts[0])>0){console.log("005: Success - ", accounts)}
	else{console.log("005: Failure", accounts)}


	/*006
	const en6 = await window.ethereum.enable()
	if(Number(en6[0]) > 0){console.log("006 - Success",en6)}
	else{console.log("006 - Failure", en6)}
	*/


	/*003
	try {
      console.log("attempting cw()")
      const addresses = await provider.request({ method: "eth_requestAccounts" });
      console.log("addresses:",addresses)
    } catch (e) {
      console.log("error in request", e);
      window.location.reload(true);
    }
    */

    //002
    //try{await provider.send("eth_requestAccounts", []);console.log("CWE:",e);}//await window.ethereum.enable();
	//catch(e){console.log("CWE:",e);window.location.reload(true)}
	console.log("doing the paints")
	$("cw").innerHTML= (window.ethereum.selectedAddress).substr(0,10) +"..."+(window.ethereum.selectedAddress).substr(34);
	if(window.ethereum.chainId==250) (new ethers.Contract("0x14ffd1fa75491595c6fd22de8218738525892101",["function getNames(address) public view returns(string[] memory)"],provider)).getNames(window.ethereum.selectedAddress).then(rn=>{if(rn.length>0){$("cw").innerHTML="hi, <span style='/*font-family:bold;font-size:1.337em*/'>"+rn[0]+"</span> 👋"}else{$("cw").innerHTML= (window.ethereum.selectedAddress).substr(0,10) +"..."+(window.ethereum.selectedAddress).substr(34);}})
	$("cw_m").innerHTML=""
	$("connect").style.display="none";
	$("switch").style.display="block";
	//farm_1_f_chappro()
	gubs();
	return(1);
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
	window.location = "#note"
	$("content1").innerHTML = c
	console.log(c)
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

    document.getElementsByClassName('tablinks')[0].click();

	$("l-ve-1").innerHTML = VENFT_NAME;
	$("l-ve-2").innerHTML = VENFT_NAME;
	$("l-ve-3").innerHTML = VENFT_NAME;
	$("l-ve-4").innerHTML = VENFT_NAME;
	$("l-ve-5").innerHTML = VENFT_NAME;
	$("l-ve-6").innerHTML = VENFT_NAME;
	$("l-ve-7").innerHTML = VENFT_NAME;
	$("l-ve-8").innerHTML = VENFT_NAME;
	$("l-ve-9").innerHTML = VENFT_NAME;

	$("l-base-1").innerHTML = BASE_NAME;
	$("l-base-2").innerHTML = BASE_NAME;

	$("l-wrap-1").innerHTML = WRAP_NAME;
	$("l-wrap-2").innerHTML = WRAP_NAME;
	$("l-wrap-3").innerHTML = WRAP_NAME;
	$("l-wrap-4").innerHTML = WRAP_NAME;
	$("l-wrap-5").innerHTML = WRAP_NAME;
	$("l-wrap-6").innerHTML = WRAP_NAME;
	$("l-wrap-7").innerHTML = WRAP_NAME;
	$("l-wrap-8").innerHTML = WRAP_NAME;
	$("l-wrap-9").innerHTML = WRAP_NAME;
	$("l-wrap-10").innerHTML = WRAP_NAME;
	$("l-wrap-11").innerHTML = WRAP_NAME;
	$("l-wrap-12").innerHTML = WRAP_NAME;

	$("l-sct-1").innerHTML = SCT_NAME;
	$("l-sct-2").innerHTML = SCT_NAME;
	$("l-sct-3").innerHTML = SCT_NAME;
	$("l-sct-4").innerHTML = SCT_NAME;
	$("l-sct-5").innerHTML = SCT_NAME;

	$("footer-contracts").innerHTML = `
		<a target="_blank" href="${EXPLORE}/token/${BASE}">${BASE_NAME}</a>
		・ <a target="_blank" href="${EXPLORE}/token/${VENFT}">${VENFT_NAME}</a>
		・ <a target="_blank" href="${EXPLORE}/token/${WRAP}">${WRAP_NAME}</a>
		・ <a target="_blank" href="${EXPLORE}/address/${STKSCT_TELLER}">Teller</a>
		・ <a target="_blank" href="${EXPLORE}/address/${ZAP_SCT}">Zapper</a>
		<br>
		<a target="_blank" href="${DOCS_LINK}">Read our Docs</a>
	`;
		//・ <a href="${EXPLORE}/address/${DEPOSITOR}">Depositor</a>
	$("partner-pools-table").innerHTML += PARTNER_POOLS.map(pool => `
    <div class="c2a90-row c2a90-row-port" onclick="window.open('${pool.link}','_blank')">
        <div class="c2a90-row-item">
            ${pool.tokens.map(t => `<div><img src="${t.icon}"> ${t.name}</div>`).join('')}
        </div>
        <div class="c2a90-row-item">
            <div><img src="${pool.platforms[0].icon}"> ${pool.platforms[0].name}</div>
            <div class="c2a90-row-item-subtext">${pool.platforms[0].subtext}</div>
        </div>
        <div class="c2a90-row-item">
            ${pool.rewards.map(r => `<div><img src="${r.icon}"> ${r.name}</div>`).join('')}
        </div>
        <div class="c2a90-row-item">
            ${pool.desc[0].maintext}
        </div>
    </div>
`).join('');


/*
	$("headline-props").innerHTML = `
		${BASE_NAME}
		<img src="${BASE_LOGO}">
		⇢
		${MARKET_NAME}
		<img src="${MARKET_LOGO}">
	`;

	$("topstat-basename-1").innerHTML = BASE_NAME;
	$("topstat-BASE_NAME-2").innerHTML = BASE_NAME;

	$("deposit-WRAP_NAME-1").innerHTML = WRAP_NAME;
	$("deposit-WRAP_NAME-2").innerHTML = WRAP_NAME;
	$("deposit-BASE_NAME-3").innerHTML = BASE_NAME;
	$("deposit-BASE_NAME-4").innerHTML = BASE_NAME;
	$("deposit-BASE_NAME-5").innerHTML = BASE_NAME;
	$("deposit-BASE_NAME-6").innerHTML = BASE_NAME;
	$("deposit-WRAP_NAME-7").innerHTML = WRAP_NAME;
	$("deposit-WRAP_NAME-8").innerHTML = WRAP_NAME;

	$("stake-WRAP_NAME-1").innerHTML = WRAP_NAME;
	$("stake-WRAP_NAME-2").innerHTML = WRAP_NAME;

	$("unstake-WRAP_NAME-1").innerHTML = WRAP_NAME;
	$("unstake-WRAP_NAME-2").innerHTML = WRAP_NAME;
	$("unstake-WRAP_NAME-3").innerHTML = WRAP_NAME;

	$("redeem-WRAP_NAME-1").innerHTML = WRAP_NAME;
	$("redeem-BASE_NAME-2").innerHTML = BASE_NAME;
	$("redeem-WRAP_NAME-3").innerHTML = WRAP_NAME;
	$("redeem-BASE_NAME-4").innerHTML = BASE_NAME;
*/
}

async function dexstats() {
	_MGR_P = new ethers.Contract( DEPOSITOR , DEPOSITOR_ABI , provider );

	_inf = await _MGR_P.info(SAFE_ADDR,[],[]);
	//STATE.user = {
	//	wrap_bal : BigInt(_inf[0][0]),
	//	wrap_allow_mgr: BigInt(_inf[0][11]),
	//	venft_bal : BigInt(_inf[0][12]),
	//}
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


	$("topstat-ve-amt").innerHTML = fornum(STATE.global.venft_amt, BASE_DEC);
	$("topstat-wrap-ts").innerHTML = fornum(STATE.global.wrap_ts, WRAP_DEC);
	$("topstat-base-per-wrap").innerHTML = (Number(STATE.global.base_per_wrap)/1e18).toFixed(6);
	$("topstat-dom").innerHTML = (Number(STATE.global.venft_amt)/Number(STATE.global.venft_ts)*100).toFixed(6)+"%";
	$("mint-fee").innerHTML = (Number(STATE.global.fees_mdb)/1e18*100) + "%";
	$("redeem-fee").innerHTML = ((Number(STATE.global.fees_rd)+Number(STATE.global.fees_rb))/1e18*100) + "%";





	/*
	_EL_27 = new ethers.Contract("0x1b1c9a41a96dE931c7508BD2C653C57C63cD32a4", EL_27_ABI, provider);
	_ds = await _EL_27.getElmaCompoundFarm( FARM , DEPOSITOR , "0x0000000000000000000000000000000000001234" );

	ds_farmtvl = (Number(_ds[4])/1e18);
	ds_farmapr = (Number(_ds[5])/1e18);
	ds_ctokenapr = (Number(_ds[6])/1e18) * 100;
	ds_farmts = (Number(_ds[3])) / (10**DECIMAL);
	ds_wrapts = (Number(_ds[2])) / (10**DECIMAL);
	ds_wrapprice = ds_farmtvl / ds_farmts;
	ds_wrapmktcap = (ds_wrapts * ds_wrapprice )
	ds_cash = (Number(_ds[8])) / 10**DECIMAL;
	ds_borrowed = (Number(_ds[9])) / 10**DECIMAL;
	ds_txs = Number(_ds[7]);

	$("topstat-tvl").innerHTML = "$" + fornum6(ds_wrapmktcap, 0)
	$("topstat-staked").innerHTML = "$" + fornum6(ds_farmtvl,0)
	$("topstat-cash").innerHTML = "$" + fornum6(ds_cash, 0)
	$("topstat-borrowed").innerHTML = "$" + fornum6(ds_borrowed, 0)

	_sftmxapr = 0;

	if(BASE_NAME == "SFTMX") {
		$("topstat-apr-native-div").style.display="block";
		_sftmxdata = await fetch("https://backend-v3.beets-ftm-node.com/", {"headers": { "content-type": "application/json",}, "body": "{\"query\":\"query {\\n  sftmxGetStakingData {\\n    exchangeRate\\n    stakingApr\\n  }\\n}\\n\"}", "method": "POST",});
		_sftmxdata = await _sftmxdata.json()
		_sftmxapr = Number(_sftmxdata.data.sftmxGetStakingData.stakingApr) * 100;
		$("topstat-apr-native").innerHTML = "+"+fornum6(_sftmxapr, _sftmxapr>10?2:4) + "% 🎶"
	}

	$("topstat-apr-yt").innerHTML = fornum6(ds_ctokenapr, (ds_ctokenapr)>10?2:4) + "%"
	$("topstat-apr-pt").innerHTML = fornum6(ds_farmapr, (ds_farmapr)>10?2:4) + "%"

	//$("topstat-tvl").innerHTML = (Number(_ds[1])/(10**DECIMAL)).toLocaleString(undefined,{maximumFractionDigits:2})

	$("topstat-dom").innerHTML = fornum6(ds_farmtvl/(ds_cash+ds_borrowed)*100, 4) + "%"

	$("stake-tvl").innerHTML =
		"$"
		+ fornum6(ds_farmtvl,2)
		+ " in Total Deposits are earning at an APR of "
		+ fornum6(ds_farmapr, ds_farmapr>10?2:4)
		+ "%"
	;

	if( $("claim-info").innerHTML == "" ) {
		for(i=0;i<TEARNED.length;i++) {
			$("claim-info").innerHTML += `
				<div><img height="20px" src="${LOGOS+TEARNED[i].toLowerCase()}.png" style="vertical-align:middle;"/> ${TEARNED_NAME[i]}</div>
            	<div class="hint"id="claim-${i}-old">Claimed: 0.000000000000000000</div>
            	<div class="hint"id="claim-${i}-pen">Pending: 0.000000000000000000</div>
            	<div class="hint"id="claim-${i}-tot">Total: 0.000000000000000000</div>
            	<br><br>
			`;
		}
	}
	*/
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


	$("topstat-ve-amt").innerHTML = fornum(STATE.global.venft_amt, BASE_DEC);
	$("topstat-wrap-ts").innerHTML = fornum(STATE.global.wrap_ts, WRAP_DEC);
	$("topstat-base-per-wrap").innerHTML = (Number(STATE.global.base_per_wrap)/1e18).toFixed(6);
	$("topstat-dom").innerHTML = (Number(STATE.global.venft_amt)/Number(STATE.global.venft_ts)*100).toFixed(6)+"%";
	$("mint-fee").innerHTML = (Number(STATE.global.fees_mdb)/1e18*100) + "%";
	$("redeem-fee").innerHTML = ((Number(STATE.global.fees_rd)+Number(STATE.global.fees_rb))/1e18*100) + "%";


	$("zap-bal").innerHTML = `Balance: ${ fornum5(STATE.user.sct_bal, SCT_DEC) } ${ SCT_NAME}`;
	$("mint-bal").innerHTML = `Balance: ${ Number(STATE.user.venft_bal) } ${ VENFT_NAME}`;
	$("stake-bal").innerHTML = `Balance: ${ fornum5(STATE.user.wrap_bal, WRAP_DEC) } ${ WRAP_NAME}`;
	$("redeem-bal").innerHTML = `Balance: ${ fornum5(STATE.user.wrap_bal, WRAP_DEC) } ${ WRAP_NAME}`;

	$("mint-table").innerHTML = STATE.user.nfts.map( (e,i) => { return `
		<div class="mint-table-row">
			<div class="mint-table-row-id"> #${ e[0] } </div>
			<div class="">
				<img style='height:20px;position:relative;top:4px' src="${VENFT_LOGO}">
				Convert ${ fornum5(e[1], BASE_DEC) } ${ BASE_NAME }
			</div>
			<div class="">
				<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}">
				Get ${ fornum5( Number(e[1]) / (Number(STATE.global.base_per_wrap)/1e18), WRAP_DEC) } ${ WRAP_NAME }
			</div>
			<div class="c2abtn submit" onclick="mint(${e[0]},${i})">Deposit</div>
		</div>
	`}).join("<br>")


	return;
}










async function zap(ismax) {
	_SCT = new ethers.Contract(SCT, LPABI, signer);
	_SCT_ZAP = new ethers.Contract(ZAP_SCT, ["function zapSCT(uint,uint) returns(uint)"],signer);

	al = await Promise.all([
		_SCT.allowance(window.ethereum.selectedAddress, ZAP_SCT),
		_SCT.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("zap-amt").value;
		if(!isFinite(_oamt) || _oamt<1/(10**SCT_DEC)){notice(`Invalid ${SCT_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**SCT_DEC)))
	}

	_wrapout = _oamt * (10n**18n) / STATE.global.base_per_wrap;

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**SCT_DEC)}<br><h3>Actual Balance:</h3>${Number(al[1])/(10**SCT_DEC)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${SCT_NAME}.`);return}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${SCT_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		//let _tr = await _WRAP.approve(FARM,_oamt);
		let _tr = await _SCT.approve(ZAP_SCT, ethers.constants.MaxUint256);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**SCT_DEC)} ${SCT_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Zapping ${SCT_NAME}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${SCT_LOGO}"> ${SCT_NAME} to Zap: <b>${fornum5(_oamt,SCT_DEC)}</b><br>
		<br><b>Expected to Get:</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> <u>${ fornum5(_wrapout,WRAP_DEC).toLocaleString() } ${WRAP_NAME}</u><br><br>
		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await (ismax ? _SCT_ZAP.zapSCT(al[1], _wrapout * 999n / 1000n) : _SCT_ZAP.zapSCT(_oamt, _wrapout * 999n / 1000n));
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Zapping ${SCT_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${SCT_LOGO}"> Zapping ${SCT_NAME}: <b>${fornum5(_oamt,SCT_DEC)}</b><br>
		<br><b>Expected to Get:</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> <u>${ fornum5(_wrapout,WRAP_DEC).toLocaleString() } ${WRAP_NAME}</u><br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${SCT_NAME} Zapped: <b>${fornum5(_oamt,SCT_DEC)}</b><br>
		<br><b>Expected to Get:</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> <u>${ fornum5(_wrapout,WRAP_DEC).toLocaleString() } ${WRAP_NAME}</u><br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
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
			${WRAP_NAME} Depositor requires your approval to complete this conversion.<br><br>
			<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
		`);
		let _tr = await ve.approve(DEPOSITOR,_id);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please continue to the next steps now.
		`);
	}
	if(alvo[1]==true) {
		notice(`
			<h3>Vote-Reset required</h3>
			${WRAP_NAME} requires your veNFT to be in a non-voted state to complete this conversion.
			<br><br>
			Resetting your Votes..
			<br><br>
			<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
		`);
		voter = new ethers.Contract(VOTER, ["function reset(uint)"], signer);
		let _tr = await voter.reset(_id);
		console.log(_tr);
		notice(`
			<h3>Submitting Vote-Reset Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Vote-Reset Completed!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the Trade at your wallet provider now.
		`);
	}



	qd = await Promise.all([
		STATE.global.venft_amt , //{amount: _mi[0][7]}, //ve.locked(ID),
		STATE.user.nfts[_idi][1] , //ve.locked(_id),
		STATE.global.wrap_ts , //wrap.totalSupply(),
		STATE.user.nfts[_idi][4] , //ve.balanceOfNFT(_id)
	]);
	console.log("sell.quoted: ",qd);
	_base = Number(qd[0]);
	_inc = Number(qd[1]);
	_ts = Number(qd[2]);
	_amt = (_inc * _ts) / _base;
	_tlw = (Number( STATE.user.nfts[_idi][2] )/86400/7 - Date.now()/86400000/7).toFixed();
	_q = [
		_amt,
		_inc,
		_tlw,
	];
	notice(`
		<h3>Order Summary</h3>
		<b>Converting veNFT:</b><br>

		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> NFT Token ID: <u>#<b>${_id}</b></u><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> Amount Locked: <u>${ fornum5(_q[1],BASE_DEC).toLocaleString() } ${BASE_NAME}</u><br>
		<img style='height:20px;position:relative;top:4px' src="https://ftm.guru/icons/lock.svg">Time to Unlock: <u>${Number(_q[2])} Weeks</u> from now<br><br>
		<b>Expected to Get:</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> <u>${ fornum5(_q[0],WRAP_DEC).toLocaleString() } ${WRAP_NAME}</u><br><br><br><br>
		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, ["function deposit(uint)"], signer);
	let _tr = await _DEPOSITOR.deposit(_id);
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<br><h4>Minting ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> <u>${ fornum5(_q[0],WRAP_DEC).toLocaleString() } ${WRAP_NAME}</u><br>
		<br><h4>Melting your ${VENFT_NAME} veNFT</h4>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> <u>veNFT #<b>${_id}</b></u>,<br>Containing <u>${ fornum5(_q[1],BASE_DEC).toLocaleString() } ${BASE_NAME}</u>,<br>Locked for <u>${Number(_q[2])} weeks</u>.<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		Minted <img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> <u>${fornum5(_q[0],WRAP_DEC)} ${WRAP_NAME}</u> for <img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> <u>veNFT #<b>${_id}</b></u>.
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`)
	gubs()



















return;
/*
	alert(ismax)
	_BASE = new ethers.Contract(BASE, LPABI, signer);
	_WRAP = new ethers.Contract(WRAP, LPABI, signer);
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, LPABI, signer);

	al = await Promise.all([
		_BASE.allowance(window.ethereum.selectedAddress, DEPOSITOR),
		_BASE.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("mint-amt").value;
		if(!isFinite(_oamt) || _oamt<1/(10**DECIMAL)){notice(`Invalid ${BASE_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Balance:</h3>${Number(al[1])/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${BASE_NAME}.`);return;}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${BASE_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		let _tr = await _BASE.approve(DEPOSITOR,_oamt);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${BASE_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Minting ${WRAP_NAME}</b><br>

		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} to Deposit: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Expected: <b>${fornum5(_oamt,DECIMAL)}</b><br>

		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await _DEPOSITOR.mint(_oamt,{gasLimit:BigInt(1_200_000)});
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Minting ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Depositing: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Expecting: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Deposited: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Received: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
*/
}

async function redeem(ismax) {
	if( (Date.now() % 604800e3) > (604800e3 - 86400e3) ) {
		notice(`Redeeming ${WRAP_NAME} to ${VE_NAME} is not available on Wednesdays..<br><br>Please try tomorrow!`);
	}

	_BASE = new ethers.Contract(BASE, LPABI, signer);
	_WRAP = new ethers.Contract(WRAP, LPABI, signer);
	_DEPOSITOR = new ethers.Contract(DEPOSITOR, DEPOSITOR_ABI, signer);

	al = await Promise.all([
		_WRAP.allowance(window.ethereum.selectedAddress, DEPOSITOR),
		_WRAP.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("redeem-amt").value;
		if(!isFinite(_oamt)){notice(`Invalid ${WRAP_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Balance:</h3>${al[1]/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${WRAP_NAME}.`);return;}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${WRAP_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		let _tr = await _WRAP.approve(DEPOSITOR,_oamt);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${WRAP_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Redeeming ${WRAP_NAME}</b><br>

		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} to Redeem: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Expected: <b>${fornum5(_oamt,DECIMAL)}</b><br>

		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await _DEPOSITOR.withdraw(_oamt);
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Redeeming ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Redeeming: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Expecting: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Redeemed: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Received: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}

async function stake(ismax) {
	_BASE = new ethers.Contract(BASE, LPABI, signer);
	_WRAP = new ethers.Contract(WRAP, LPABI, signer);
	_FARM = new ethers.Contract(FARM, LPABI, signer);

	al = await Promise.all([
		_WRAP.allowance(window.ethereum.selectedAddress, FARM),
		_WRAP.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[1];
	}

	else {
		_oamt = $("stake-amt").value;
		if(!isFinite(_oamt) || _oamt<1/(10**DECIMAL)){notice(`Invalid ${BASE_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)))
	}


	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Balance:</h3>${Number(al[1])/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or accumulate some more ${WRAP_NAME}.`);return}

	if(Number(_oamt)>Number(al[0])){
		notice(`
			<h3>Approval required</h3>
			Please grant ${WRAP_NAME} allowance.<br><br>
			<h4><u><i>Confirm this transaction in your wallet!</i></u></h4>
		`);
		//let _tr = await _WRAP.approve(FARM,_oamt);
		let _tr = await _WRAP.approve(FARM, ethers.constants.MaxUint256);
		console.log(_tr);
		notice(`
			<h3>Submitting Approval Transaction!</h3>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
		`);
		_tw = await _tr.wait()
		console.log(_tw)
		notice(`
			<h3>Approval Completed!</h3>
			<br>Spending rights of ${Number(_oamt)/(10**DECIMAL)} ${WRAP_NAME} granted.<br>
			<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
			<br><br>
			Please confirm the next step with your wallet provider now.
		`);
	}

	notice(`
		<h3>Order Summary</h3>
		<b>Staking ${WRAP_NAME}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} to Stake: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await (ismax ? _FARM.depositAll() : _FARM.deposit(_oamt));
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Staking ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Staking: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${WRAP_NAME} Staked: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}

async function unstake(ismax) {
	_FARM = new ethers.Contract(FARM, LPABI,signer);

	al = await Promise.all([
		_FARM.balanceOf(window.ethereum.selectedAddress)
	]);

	_oamt = null;

	if(ismax) {
		_oamt = al[0];
	}
	else {
		_oamt = $("unstake-amt").value;
		if(!isFinite(_oamt)){notice(`Invalid ${WRAP_NAME} amount!`); return;}
		_oamt = BigInt(Math.floor(_oamt * (10**DECIMAL)));
	}

	if(Number(_oamt)>Number(al[1])) {notice(`<h2>Insufficient Staked Balance!</h2><h3>Desired Amount:</h3>${Number(_oamt)/(10**DECIMAL)}<br><h3>Actual Staked Balance:</h3>${al[1]/(10**DECIMAL)}<br><br><b>Please reduce the amount and retry again, or Stake some more ${WRAP_NAME}.`); return}

	notice(`
		<h3>Order Summary</h3>
		<b>Withdrawing ${WRAP_NAME}</b><br>

		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} to Redeem: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<img style='height:20px;position:relative;top:4px' src="${BASE_LOGO}"> ${BASE_NAME} Expected: <b>${fornum5(_oamt,DECIMAL)}</b><br>

		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await (ismax ? _FARM.withdrawAll() : _FARM.withdraw(_oamt));
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<h4>Unstaking ${WRAP_NAME}</h4>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Unstaking: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<img style='height:20px;position:relative;top:4px' src="${WRAP_LOGO}"> ${WRAP_NAME} Unstaked: <b>${fornum5(_oamt,DECIMAL)}</b><br>
		<br><br>
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}

async function claim() {
	_FARM = new ethers.Contract(FARM, LPABI,signer);
	_VOTER = new ethers.Contract(VOTER, ["function claimRewards(address[],address[][])"],signer);

	_earned = await Promise.all([
		_FARM.earned(TEARNED[0], window.ethereum.selectedAddress),
		_FARM.earned(TEARNED[1], window.ethereum.selectedAddress),
	]);

	if(Number(_earned[0]) == 0 && Number(_earned[1]) == 0 ) {notice(`<h3>You dont have any pending rewards!</h3> Stake some ${WRAP_NAME} to earn more!`); return;}

	notice(`
		<h3>Order Summary</h3>
		<b>Claiming ${TEARNED_NAME.join("+")} rewards</b>
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[0]}"> <b>${fornum5(_earned[0],18)}</b> ${TEARNED_NAME[0]}
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[1]}"> <b>${fornum5(_earned[1],18)}</b> ${TEARNED_NAME[1]}
		<h4><u><i>Please Confirm this transaction in your wallet!</i></u></h4>
	`);
	let _tr = await _VOTER.claimRewards([FARM],[TEARNED],{gasLimit:BigInt(1_500_000)});
	console.log(_tr);
	notice(`
		<h3>Order Submitted!</h3>
		<b>Claiming ${TEARNED_NAME.join("+")} rewards</b>
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[0]}"> <b>${fornum5(_earned[0],18)}</b> ${TEARNED_NAME[0]}
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[1]}"> <b>${fornum5(_earned[1],18)}</b> ${TEARNED_NAME[1]}
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	_tw = await _tr.wait();
	console.log(_tw)
	notice(`
		<h3>Order Completed!</h3>
		<b>Claiming ${TEARNED_NAME.join("+")} rewards</b>
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[0]}"> <b>${fornum5(_earned[0],18)}</b> ${TEARNED_NAME[0]}
		<br><img style='height:20px;position:relative;top:4px' src="${TEARNED_LOGO[1]}"> <b>${fornum5(_earned[1],18)}</b> ${TEARNED_NAME[1]}
		<h4><a target="_blank" href="${EXPLORE}/tx/${_tr.hash}">View on Explorer</a></h4>
	`);
	gubs();
}
