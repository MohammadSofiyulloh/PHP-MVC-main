<?php

class Activity extends Controller {
    public function activity1()
    {
        $data['title'] = 'Making Coffee';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_non_home');
        $this->view('activity/makingCoffee');
        $this->view('templates/footer');
    }

    public function activity2()
    {
        $data['title'] = 'Barista Class';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_non_home');
        $this->view('activity/baristaClass');
        $this->view('templates/footer');
    }

    public function activity3()
    {
        $data['title'] = 'Booking Class Online';
        $this->view('templates/header', $data);
        $this->view('templates/navbar_non_home');
        $this->view('activity/bookingClassOnline');
        $this->view('templates/footer');
    }
}