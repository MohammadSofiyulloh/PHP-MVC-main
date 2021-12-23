<?php

class Home extends Controller {
    public function index()
    {
        $data['title'] = 'Selamat Datang Di Caffeine Coffee Class';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_home');
        $this->view('home/index');
        $this->view('templates/footer');
    }
}