<?php

class Kegiatan extends Controller {
    public function activity1()
    {
        $data['title'] = 'Making Coffee';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_non_home');
        $this->view('activity/making_coffee');
        $this->view('templates/footer');
    }

    public function activity2()
    {
        $data['title'] = 'Barista Class';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_non_home');
        $this->view('activity/barista_class');
        $this->view('templates/footer');
    }

    public function activity3()
    {
        $data['title'] = 'Booking Class Online';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_non_home');
        $this->view('activity/booking_class_online');
        $this->view('templates/footer');
    }
}