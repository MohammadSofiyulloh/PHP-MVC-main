<?php

class databasePendaftar
{
    private $table = 'pendaftar';
    private $db;

    public function __construct()
    {
        $this->db = new Database;
    }

    public function tambahData($data)
    {
        $query = "INSERT INTO pendaftar
                    VALUES
                    (:id, :email, :nama, :noHP, :cv, '')";
        $this->db->query($query);
        $this->db->bind('id', null);
        $this->db->bind('email', htmlspecialchars($data['email']));
        $this->db->bind('nama', htmlspecialchars($data['nama']));
        $this->db->bind('noHP', htmlspecialchars($data['noHP']));
        $this->db->execute();
        return $this->db->rowCount();
    }

    public function selectPenerima()
    {
        $query = "SELECT * from ". $this->table ." where status='diterima'";
        $this->db->query($query);
        $this->db->execute();
        return $this->db->resultSet();
    }

    public function selectPendaftar()
    {
        $query = "SELECT * from ". $this->table . " WHERE status=''";
        $this->db->query($query);
        $this->db->execute();
        return $this->db->resultSet();
    }

    public function updateData($daftarID)
    {
        $query = "UPDATE pendaftar SET status = 'diterima' WHERE daftarID = :daftarID ";
        $this->db->query($query);
        $this->db->bind('daftarID', $daftarID);
        $this->db->execute();
        return $this->db->rowCount();

    }

    public function dropData($daftarID)
    {
        $query = "DELETE FROM `pendaftar` WHERE `pendaftar`.`daftarID` = :daftarID";
        $this->db->query($query);
        $this->db->bind('daftarID', $daftarID);
        $this->db->execute();
        return $this->db->rowCount();
    }


}