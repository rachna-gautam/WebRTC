export class WebRTCHandler {
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private peerConnection: RTCPeerConnection;
    private onTrackCallback: ((stream: MediaStream) => void) | null = null;
  
    constructor(
      private config: RTCConfiguration = {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      }
    ) {
      this.peerConnection = new RTCPeerConnection(this.config);
      this.setupListeners();
    }
  
    private setupListeners() {
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.onIceCandidateCallback) {
          this.onIceCandidateCallback(event.candidate);
        }
      };
  
      this.peerConnection.ontrack = (event) => {
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream();
        }
        this.remoteStream.addTrack(event.track);
        if (this.onTrackCallback) {
          this.onTrackCallback(this.remoteStream);
        }
      };
    }
  
    private onIceCandidateCallback: ((candidate: RTCIceCandidate) => void) | null = null;
  
    public async setLocalStream(): Promise<MediaStream> {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream!);
      });
      return this.localStream;
    }
  
    public getLocalStream() {
      return this.localStream;
    }
  
    public getRemoteStream() {
      return this.remoteStream;
    }
  
    public async createOffer(): Promise<RTCSessionDescriptionInit> {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    }
  
    public async createAnswer(): Promise<RTCSessionDescriptionInit> {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    }
  
    public async setRemoteDescription(desc: RTCSessionDescriptionInit) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
    }
  
    public async addIceCandidate(candidate: RTCIceCandidateInit) {
      if (candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }
  
    public onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
      this.onIceCandidateCallback = callback;
    }
  
    public onRemoteStream(callback: (stream: MediaStream) => void) {
      this.onTrackCallback = callback;
    }
  
    public closeConnection() {
      this.peerConnection.close();
      this.localStream?.getTracks().forEach((track) => track.stop());
      this.remoteStream?.getTracks().forEach((track) => track.stop());
    }
  }
  