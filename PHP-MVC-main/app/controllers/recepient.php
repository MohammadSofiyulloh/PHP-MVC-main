<?php

class Penerima extends Controller {
    public function index()
    {
        $data['title'] = 'Data Peserta Diterima';
        $data['pendaftar'] = $this->model('databasePendaftar')->selectPenerima();
        $this->view('templates/header', $data);
        $this->view('templates/navbar_participant');
        $this->view('penerima/index', $data);
        $this->view('templates/footer');
    }

}
