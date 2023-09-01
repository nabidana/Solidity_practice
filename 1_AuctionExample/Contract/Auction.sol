pragma solidity ^0.4.24;

//contract가 완벽하지않음.
//잘못된 contract 수정 혹은 잘못된 로직을 수정하기
//html이 자동새로고침이 안됏음. <- 과제
contract Auction {
    address internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid; //금액
    address public highestBidder; //최고입찰자
    
    enum auction_state { //금액 상태 변수
        CANCELLED, STARTED
    }
    
    struct car {
        string Brand;
        string Rnumber;
    }
    
    car public Mycar;
    address[] bidders; //20바이트짜리 주소
    mapping(address => uint) public bids; //hashmap 같은것
    auction_state public STATE;
    
    modifier an_ongoing_auction(){ //스프링의 AOP와 동일한 것.
        require(now <= auction_end);
        _;
    }
    
    modifier only_owner(){  //스프링의 AOP와 동일한 것.
        require(msg.sender == auction_owner);
        _;
    }
    
    function bid() public payable returns (bool) {}
    function withdraw() public returns (bool) {}
    function cancel_auction() external returns (bool) {}
    
    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);
}

contract MyAuction is Auction{ //상속받음

    constructor(uint _biddingTime, address _owner,string _brand,string _Rnumber) public  {
        auction_owner = _owner;
        auction_start=now;
        auction_end = auction_start + _biddingTime*1  hours;
        STATE=auction_state.STARTED;
        Mycar.Brand=_brand;
        Mycar.Rnumber=_Rnumber;
        
    }
 

 function bid() public payable an_ongoing_auction returns (bool){
      
        require(bids[msg.sender]+msg.value> highestBid,"You can't bid, Make a higher Bid");
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);
        bids[msg.sender]=  bids[msg.sender]+msg.value;
        emit BidEvent(highestBidder,  highestBid);

        return true;
    }
    
 
//옥션 취소하기
function cancel_auction() external only_owner  an_ongoing_auction returns (bool){
    
        STATE=auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", now);
        return true;
     }
    
    
//옥션 없애기
function destruct_auction() external only_owner returns (bool){
        
    require(now > auction_end,"You can't destruct the contract,The auction is still open");
    for(uint i=0;i<bidders.length;i++)
    {
        //assert 조건 불충족시 예외 발생시키고 종료
        assert(bids[bidders[i]]==0);
    }

    selfdestruct(auction_owner);
    return true;
    
    }

//입찰 취소    
function withdraw() public returns (bool){
        //require(now > auction_end ,"You can't withdraw, the auction is still open");
        uint amount;

        amount=bids[msg.sender];
        bids[msg.sender]=0;
        msg.sender.transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
      
    }
    
function get_owner() public view returns(address){
        return auction_owner;
    }
}